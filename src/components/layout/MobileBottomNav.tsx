"use client";

import {
	FileSearch,
	Grid,
	House,
	Info,
	type LucideIcon,
	MapPin,
} from "lucide-react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ROUTES } from "@/lib/constants/routes";
import { scrollToTop } from "@/lib/utils/scroll";
import type { LayoutMenuItem } from "@/types/layout";
import { MobileCategoriesMenu } from "./MobileCategoriesMenu";

/** Phân loại tab bottom nav — dùng enum thay vì string rải rác */
export enum MobileNavItemKind {
	Link = "link",
	Categories = "categories",
}

/** Tab có `href` — điều hướng bằng router */
type MobileNavLinkItem = {
	kind: MobileNavItemKind.Link;
	label: string;
	href: string;
	icon: LucideIcon;
};

/** Tab mở sheet danh mục — không có route */
type MobileNavCategoriesItem = {
	kind: MobileNavItemKind.Categories;
	label: string;
	icon: LucideIcon;
};

type MobileNavItem = MobileNavLinkItem | MobileNavCategoriesItem;

const NAV_ITEMS: readonly MobileNavItem[] = [
	{
		kind: MobileNavItemKind.Link,
		label: "Trang chủ",
		href: ROUTES.HOME,
		icon: House,
	},
	{ kind: MobileNavItemKind.Categories, label: "Danh mục", icon: Grid },
	{
		kind: MobileNavItemKind.Link,
		label: "Tra cứu",
		href: ROUTES.ORDER_TRACKING,
		icon: FileSearch,
	},
	{
		kind: MobileNavItemKind.Link,
		label: "Cửa hàng",
		href: ROUTES.STORE_LOCATOR,
		icon: MapPin,
	},
	{
		kind: MobileNavItemKind.Link,
		label: "Giới thiệu",
		href: ROUTES.ABOUT,
		icon: Info,
	},
];

const N = NAV_ITEMS.length;

/** Eased spring cubic-bezier — feels like liquid */
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
/** Drag threshold to enter scrub mode */
const SCRUB_THRESHOLD = 12; // px

interface MobileBottomNavProps {
	menuItems?: LayoutMenuItem[];
}

export function MobileBottomNav({ menuItems = [] }: MobileBottomNavProps) {
	const pathname = usePathname();
	const router = useRouter();
	const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
	const [isPressed, setIsPressed] = useState(false);
	const vibratedIdxRef = useRef<number>(-1);

	// Hide Mobile NAV chỉ cho các route system biết trước (cart, checkout, ...).
	// Trước đây có heuristic ẩn nav cho mọi slug 1-segment — gây ẩn nhầm trang
	// tin tức, category, page. Bỏ heuristic, dùng explicit whitelist.
	const isHidden =
		pathname === ROUTES.CART ||
		pathname === ROUTES.CHECKOUT ||
		pathname === ROUTES.TRADE_IN ||
		pathname === ROUTES.INSTALLMENT;

	// ── Derive active index from URL ──
	const urlActiveIdx = NAV_ITEMS.findIndex((item) => {
		if (item.kind === MobileNavItemKind.Categories)
			return isCategoriesOpen;
		if (item.href === ROUTES.HOME) return pathname === ROUTES.HOME;
		return pathname?.startsWith(item.href) ?? false;
	});

	// ── Indicator visual position (float 0..N-1) ──
	const [committedIdx, setCommittedIdx] = useState(() =>
		Math.max(0, urlActiveIdx),
	);
	const [visualPos, setVisualPos] = useState(() => Math.max(0, urlActiveIdx));
	const [isScrubbing, setIsScrubbing] = useState(false);

	// Sync from URL changes (e.g. browser back, Link navigation)
	useEffect(() => {
		if (!isScrubbing && urlActiveIdx >= 0) {
			setCommittedIdx(urlActiveIdx);
			setVisualPos(urlActiveIdx);
		}
	}, [urlActiveIdx, isScrubbing]);

	const displayPos = isScrubbing ? visualPos : committedIdx;

	// ── Drag refs ──
	const navRef = useRef<HTMLDivElement>(null);
	const startXRef = useRef<number | null>(null);
	const prevPosRef = useRef<number>(0); // for velocity stretch

	// ── Map pointer X → float position ──
	function toPos(clientX: number): number {
		if (!navRef.current) return displayPos;
		const rect = navRef.current.getBoundingClientRect();
		// rel is relative X within the nav bounds
		const rel = clientX - rect.left;
		// The width of exactly 1 tab
		const tabWidth = Math.max(1, rect.width / N);
		// Mapping: center of tab 0 should be index 0.
		// rel = 0.5 * tabWidth => pos = 0
		const pos = rel / tabWidth - 0.5;
		return Math.max(0, Math.min(N - 1, pos));
	}

	function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
		if ((e.target as HTMLElement).closest("a")) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		startXRef.current = e.clientX;
		prevPosRef.current = displayPos;
		setIsPressed(true);

		const rawIdx = toPos(e.clientX);
		vibratedIdxRef.current = Math.round(rawIdx);

		if (typeof navigator !== "undefined" && navigator.vibrate) {
			navigator.vibrate(5);
		}
	}

	function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
		if (startXRef.current === null) return;
		const dx = Math.abs(e.clientX - startXRef.current);
		if (!isScrubbing && dx < SCRUB_THRESHOLD) return;

		if (!isScrubbing) {
			setIsScrubbing(true);
			document.body.style.userSelect = "none";
		}

		prevPosRef.current = visualPos;
		const newPos = toPos(e.clientX);
		setVisualPos(newPos);

		const currentIdx = Math.round(newPos);
		if (currentIdx !== vibratedIdxRef.current) {
			vibratedIdxRef.current = currentIdx;
			if (typeof navigator !== "undefined" && navigator.vibrate) {
				navigator.vibrate(10);
			}
		}
	}

	function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
		if (startXRef.current === null) return;
		const dx = Math.abs(e.clientX - startXRef.current);

		setIsPressed(false);
		document.body.style.userSelect = "";
		setIsScrubbing(false);
		startXRef.current = null;

		if (dx < SCRUB_THRESHOLD) {
			const tapPos = toPos(e.clientX);
			const tappedIdx = Math.round(tapPos);
			navigateTo(tappedIdx);
		} else {
			const finalPos = toPos(e.clientX);
			const snapped = Math.round(finalPos);
			setVisualPos(snapped);
			navigateTo(snapped);
		}
	}

	function navigateTo(idx: number) {
		const item = NAV_ITEMS[idx];
		if (!item) return;

		if (item.kind === MobileNavItemKind.Categories) {
			setCommittedIdx(idx);
			setIsCategoriesOpen(true);
			return;
		}

		setCommittedIdx(idx);
		setIsCategoriesOpen(false);
		if (item.href !== pathname) {
			scrollToTop();
			router.push(item.href as Route);
		}
	}

	// ── Liquid stretch calculation ──
	// How far is displayPos from the nearest integer center?
	const fractional = displayPos % 1; // 0..1
	const distFromHalf = Math.abs(fractional - 0.5); // 0 at half, 0.5 at integers
	// Max stretch when halfway between tabs, none when at center
	const normalizedDist = 1 - distFromHalf * 2; // 0 at integers, 1 at halfway
	const stretchX = isScrubbing ? 1 + normalizedDist * 0.55 : 1;
	const squishY = isScrubbing ? 1 / (1 + normalizedDist * 0.12) : 1;
	// Direction: which side the indicator is "pulling from"
	const stretchOrigin = fractional > 0.5 ? "left center" : "right center";

	// Return null before rendering anything if hidden
	if (isHidden) return null;

	return (
		<>
			{/* ── SVG filter definitions ── */}
			<svg
				className="fixed w-0 h-0 overflow-hidden pointer-events-none"
				aria-hidden="true"
			>
				<defs>
					{/*
					 * Gooey / liquid blob filter
					 * Blur edges → color matrix threshold → creates organic merging
					 */}
					<filter
						id="nav-liquid"
						x="-40%"
						y="-40%"
						width="180%"
						height="180%"
						colorInterpolationFilters="sRGB"
					>
						<feGaussianBlur
							in="SourceGraphic"
							stdDeviation="8"
							result="blur"
						/>
						<feColorMatrix
							in="blur"
							type="matrix"
							values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -12"
							result="goo"
						/>
						{/* Move shadow directly into native SVG pipeline to fix Safari ghosting/smearing */}
						<feDropShadow
							in="goo"
							dx="0"
							dy="2"
							stdDeviation="4"
							floodColor="#1312e9"
							floodOpacity="0.25"
							result="goo-shadow"
						/>
						<feComposite
							in="SourceGraphic"
							in2="goo-shadow"
							operator="atop"
						/>
					</filter>
				</defs>
			</svg>

			{/* ── Layout spacer ── */}
			<div className="h-20 md:hidden block shrink-0" />

			{/* ── Floating nav pill ── */}
			<div
				className="fixed left-0 right-0 z-60 flex justify-center pb-2 px-3 pointer-events-none md:hidden transition-all duration-300 ease-in-out"
				style={{
					bottom: 0,
				}}
			>
				<nav
					ref={navRef}
					data-sticky="mobile-nav"
					className="pointer-events-auto touch-none w-full max-w-[420px] relative overflow-visible"
					aria-label="Navigation chính"
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onPointerCancel={onPointerUp}
					onContextMenu={(e) => e.preventDefault()}
					style={{
						height: "62px",
						borderRadius: "31px",
						background: "rgba(255, 255, 255, 0.5)",
						backdropFilter: "blur(28px) saturate(180%)",
						WebkitBackdropFilter: "blur(28px) saturate(180%)",
						border: "1px solid rgba(255,255,255,0.8)",
						boxShadow:
							"inset 0 1px 0 rgba(255,255,255,1)," +
							"0 12px 40px rgba(0,0,0,0.08)," +
							"0 4px 12px rgba(0,0,0,0.04)",
						transform: isPressed
							? "scale(0.97) translateY(2px) translateZ(0)"
							: "scale(1) translateY(0) translateZ(0)",
						transition:
							"transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2)",
					}}
				>
					{/*
					 * ── Gooey indicator layer ──
					 * This layer has the SVG gooey filter.
					 * The indicator blob inside slides smoothly — the gooey filter
					 * makes its edges organically merge/stretch as it moves.
					 */}
					<div
						className="absolute top-0 bottom-0 left-[5px] right-[5px] overflow-hidden pointer-events-none"
						style={{
							filter: "url(#nav-liquid)", // pure SVG filter, no CSS
							WebkitFilter: "url(#nav-liquid)",
							borderRadius: "26px", // matching inner radius
						}}
						aria-hidden="true"
					>
						<div
							style={{
								position: "absolute",
								top: "5px",
								bottom: "5px",
								// Slide indicator to visualPos (continuous, not snapped)
								left: `${(displayPos / N) * 100}%`,
								width: `${(1 / N) * 100}%`,
								// Liquid stretch: scaleX in movement direction + FORCE HARDWARE ACCEL
								transform: `scaleX(${stretchX}) scaleY(${squishY}) translateZ(0)`,
								WebkitTransform: `scaleX(${stretchX}) scaleY(${squishY}) translateZ(0)`,
								transformOrigin: stretchOrigin,
								transition: isScrubbing
									? "none"
									: `left 0.52s ${SPRING}, transform 0.4s ${SPRING}`,
								// The indicator bubble: Solid pale pink to survive the gooey alpha filter
								// Using alpha = 1.0 is REQUIRED for smooth stretching in SVG filters
								background: "rgb(255, 235, 238)",
								borderRadius: "26px",
								// Note: Drop shadow is handled by the parent's filter wrapper
								boxShadow:
									"inset 0 1px 1px rgba(255,255,255,0.8)",
							}}
						/>
					</div>

					{/* ── Nav item icons & labels ── */}
					<div className="absolute inset-0 flex items-center justify-around px-1">
						{NAV_ITEMS.map((item, index) => {
							const nearestSnap = Math.round(displayPos);
							const isActive = nearestSnap === index;
							const Icon = item.icon;

							// Proximity: how close is the indicator center to this tab?
							const proximity = Math.max(
								0,
								1 - Math.abs(displayPos - index),
							);

							return (
								<div
									key={item.label}
									className="flex flex-col items-center justify-center gap-[3px] flex-1 h-full z-10 pointer-events-none"
								>
									{/* Icon */}
									<div
										style={{
											transform: `scale(${1 + proximity * 0.18}) translateY(${-proximity * 2}px)`,
											transition: isScrubbing
												? "transform 0.08s ease-out"
												: `transform 0.45s ${SPRING}`,
											filter:
												proximity > 0.5
													? `drop-shadow(0 1px 6px rgba(255,255,255,${0.2 * proximity}))`
													: "none",
										}}
									>
										<Icon
											className="size-[22px]"
											strokeWidth={isActive ? 2.2 : 1.5}
											style={{
												color: `color-mix(in srgb, #1312e9 ${proximity * 100}%, #6a7282)`,
												transition:
													"color 0.2s ease, filter 0.2s ease",
											}}
										/>
									</div>

									{/* Label */}
									<span
										style={{
											fontSize: "10px",
											lineHeight: 1,
											fontWeight: isActive ? 700 : 500,
											color: `color-mix(in srgb, #1312e9 ${proximity * 100}%, #6a7282)`,
											transition:
												"color 0.2s ease, font-weight 0.2s ease",
											letterSpacing: isActive
												? "0.02em"
												: "0",
										}}
									>
										{item.label}
									</span>
								</div>
							);
						})}
					</div>
				</nav>
			</div>

			<MobileCategoriesMenu
				open={isCategoriesOpen}
				onClose={() => setIsCategoriesOpen(false)}
				menuItems={menuItems}
			/>
		</>
	);
}
