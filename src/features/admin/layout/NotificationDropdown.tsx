"use client";

import {
	Bell,
	BellOff,
	CheckCheck,
	Package,
	ShoppingBag,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useClickOutside } from "@/features/admin/ui";

type NotiType = "order" | "product" | "system";

interface NotiItem {
	id: number;
	type: NotiType;
	title: string;
	body?: string;
	href?: string;
	createdAt: string;
	seen: boolean;
}

// TODO: thay bằng SWR call `GET /cms/notifications` + `unread-count`.
const MOCK_NOTIS: NotiItem[] = [
	{
		id: 1,
		type: "order",
		title: "Đơn hàng #1024 mới",
		body: "Khách Nguyễn Văn A đã đặt 2 sản phẩm",
		href: "/admin/orders/1024",
		createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
		seen: false,
	},
	{
		id: 2,
		type: "product",
		title: "Sản phẩm sắp hết hàng",
		body: "Pinaco N50 còn 3 sản phẩm trong kho",
		href: "/admin/products",
		createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
		seen: false,
	},
	{
		id: 3,
		type: "system",
		title: "Backup hệ thống thành công",
		body: "Backup hàng ngày đã hoàn tất lúc 03:00",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
		seen: true,
	},
];

const TYPE_META: Record<
	NotiType,
	{
		icon: React.ComponentType<{ className?: string }>;
		bg: string;
		fg: string;
		label: string;
	}
> = {
	order: {
		icon: ShoppingBag,
		bg: "bg-blue-50",
		fg: "text-blue-600",
		label: "Đơn hàng",
	},
	product: {
		icon: Package,
		bg: "bg-amber-50",
		fg: "text-amber-600",
		label: "Sản phẩm",
	},
	system: {
		icon: Sparkles,
		bg: "bg-purple-50",
		fg: "text-purple-600",
		label: "Hệ thống",
	},
};

function timeAgo(iso: string): string {
	const ms = Date.now() - new Date(iso).getTime();
	const min = Math.floor(ms / 60_000);
	if (min < 1) return "Vừa xong";
	if (min < 60) return `${min} phút trước`;
	const hr = Math.floor(min / 60);
	if (hr < 24) return `${hr} giờ trước`;
	const day = Math.floor(hr / 24);
	if (day < 7) return `${day} ngày trước`;
	return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

type TabKey = "all" | "unread";

export function NotificationDropdown() {
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState<TabKey>("all");
	const ref = useRef<HTMLDivElement>(null);
	useClickOutside(ref, open, () => setOpen(false));

	const unread = MOCK_NOTIS.filter((n) => !n.seen).length;
	const filtered = useMemo(
		() => (tab === "unread" ? MOCK_NOTIS.filter((n) => !n.seen) : MOCK_NOTIS),
		[tab],
	);

	function handleMarkAllRead() {
		// TODO: gọi PATCH /cms/notifications/seen
	}

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${open ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
				aria-label="Thông báo"
				aria-expanded={open}
			>
				<Bell className="h-5 w-5" />
				{unread > 0 && (
					<span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
						{unread > 9 ? "9+" : unread}
					</span>
				)}
			</button>

			{open && (
				<div className="absolute right-0 top-full z-30 mt-2 w-[440px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl ring-1 ring-black/5">
					{/* Header */}
					<div className="flex items-center justify-between gap-3 px-5 pt-4 pb-1">
						<div className="flex items-center gap-2">
							<h3 className="text-base font-bold text-gray-900">Thông báo</h3>
							{unread > 0 && (
								<span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-xs font-semibold text-red-700">
									{unread}
								</span>
							)}
						</div>
						{unread > 0 && (
							<button
								type="button"
								onClick={handleMarkAllRead}
								className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
							>
								<CheckCheck className="h-3.5 w-3.5" />
								Đọc tất cả
							</button>
						)}
					</div>

					{/* Tabs */}
					<div className="flex gap-1 border-b border-gray-100 px-2">
						<TabButton active={tab === "all"} onClick={() => setTab("all")}>
							Tất cả{" "}
							<span className="ml-1 text-xs text-gray-400">{MOCK_NOTIS.length}</span>
						</TabButton>
						<TabButton active={tab === "unread"} onClick={() => setTab("unread")}>
							Chưa đọc
							{unread > 0 && (
								<span
									className={`ml-1 text-xs ${tab === "unread" ? "text-blue-600" : "text-gray-400"}`}
								>
									{unread}
								</span>
							)}
						</TabButton>
					</div>

					{/* List */}
					<div className="max-h-[420px] overflow-y-auto">
						{filtered.length === 0 ? (
							<EmptyState tab={tab} />
						) : (
							<ul className="divide-y divide-gray-50">
								{filtered.map((noti) => (
									<NotificationRow
										key={noti.id}
										noti={noti}
										onClick={() => setOpen(false)}
									/>
								))}
							</ul>
						)}
					</div>

					{/* Footer */}
					<div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3">
						<Link
							href="/admin/notifications"
							className="flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
							onClick={() => setOpen(false)}
						>
							Xem tất cả thông báo
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}

function TabButton({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`relative px-3 py-2.5 text-sm font-medium transition-colors ${
				active ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
			}`}
		>
			{children}
			{active && (
				<span className="absolute inset-x-3 bottom-0 h-0.5 rounded-t-full bg-blue-600" />
			)}
		</button>
	);
}

function NotificationRow({ noti, onClick }: { noti: NotiItem; onClick: () => void }) {
	const meta = TYPE_META[noti.type];
	const Icon = meta.icon;

	const content = (
		<div
			className={`group relative flex gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50 ${noti.seen ? "" : "bg-blue-50/30"}`}
		>
			{/* Icon */}
			<div
				className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.bg}`}
			>
				<Icon className={`h-5 w-5 ${meta.fg}`} />
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-2">
					<p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
						{noti.title}
					</p>
					{!noti.seen && (
						<span
							className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-blue-500"
							aria-label="Chưa đọc"
						/>
					)}
				</div>
				{noti.body && (
					<p className="mt-0.5 line-clamp-2 text-sm text-gray-600">{noti.body}</p>
				)}
				<div className="mt-1.5 flex items-center gap-2 text-xs text-gray-400">
					<span className={`font-medium ${meta.fg}`}>{meta.label}</span>
					<span>·</span>
					<span>{timeAgo(noti.createdAt)}</span>
				</div>
			</div>
		</div>
	);

	if (noti.href) {
		return (
			<li>
				<Link href={noti.href} onClick={onClick} className="block">
					{content}
				</Link>
			</li>
		);
	}
	return (
		<li>
			<button type="button" onClick={onClick} className="block w-full text-left">
				{content}
			</button>
		</li>
	);
}

function EmptyState({ tab }: { tab: TabKey }) {
	return (
		<div className="flex flex-col items-center justify-center px-6 py-12 text-center">
			<div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
				<BellOff className="h-7 w-7 text-gray-400" />
			</div>
			<p className="mt-3 text-sm font-medium text-gray-900">
				{tab === "unread" ? "Không có thông báo chưa đọc" : "Chưa có thông báo nào"}
			</p>
			<p className="mt-1 text-xs text-gray-500">
				{tab === "unread"
					? "Tất cả thông báo đã được đọc"
					: "Khi có hoạt động mới, bạn sẽ thấy ở đây"}
			</p>
		</div>
	);
}
