import {
	Clock,
	FileSearch,
	FileText,
	House,
	Phone,
	Search,
	Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { HeaderSearchSlot } from "@/components/feature/search/header-search-slot";
import { ROUTES } from "@/lib/constants/routes";
import { CONTACT } from "@/lib/constants/site-info";
import { cn } from "@/lib/utils/cn";
import type { LayoutMenuItem } from "@/types/layout";
import { CategoriesMenu } from "./CategoriesMenu";
import { HeaderCartIcon } from "./HeaderCartIcon";
import { HeaderNavItem } from "./header-compound/HeaderNavItem.client";

interface HeaderProps {
	className?: string;
	showTopBar?: boolean;
	showBottomNav?: boolean;
	menuItems?: LayoutMenuItem[];
}

export default function Header({
	className = "",
	showTopBar = true,
	showBottomNav = true,
	menuItems = [],
}: HeaderProps) {
	const topBar = showTopBar ? (
		<div className="bg-primary-600 z-50">
			<div className="container-inner py-1.5 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<NavItem icon={Phone} label={CONTACT.hotlineDisplay} />
					<NavItem icon={Clock} label="Mở cửa 24/7" />
					<span className="hidden md:contents">
						<NavItem icon={Truck} label="Tư vấn & khảo sát tận nơi" />
					</span>
				</div>
				<div className="hidden md:flex items-center gap-3">
					<NavItem
						icon={House}
						label="Cửa hàng"
						href={ROUTES.STORE_LOCATOR}
					/>
					<NavItem
						icon={Search}
						label="Tra cứu đơn hàng"
						href={ROUTES.ORDER_TRACKING}
					/>
				</div>
			</div>
		</div>
	) : null;

	const mainRow = (
		<div className="bg-white container-inner">
			<div className="bg-white py-1 md:py-2 flex gap-2 md:gap-3 flex-col">
				<div className="flex items-center gap-2 md:gap-4">
					<Link
						href="/"
						className="shrink-0 hover:opacity-80 transition-opacity"
					>
						<Image
							src="/logo.jpg"
							alt="Công ty TNHH Kỹ thuật - Dịch vụ NORA"
							width={120}
							height={40}
							priority
							loading="eager"
							fetchPriority="high"
							sizes="(max-width: 768px) 80px, 120px"
							className="h-10 md:h-12 w-auto bg-transparent"
							unoptimized
						/>
					</Link>
					<HeaderSearchSlot placement="inline" />
					<div className="flex items-center ml-auto md:ml-0 shrink-0">
						<Link
							href={ROUTES.ABOUT}
							className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
							aria-label="Giới thiệu"
						>
							<FileSearch className="size-5" />
							<span className="hidden md:inline">Giới thiệu</span>
						</Link>
						<Link
							href={ROUTES.WHOLESALE}
							className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
							aria-label="Báo giá đại lý"
						>
							<FileText className="size-5" />
							<span className="hidden md:inline">Báo giá đại lý</span>
						</Link>
						<HeaderCartIcon />
					</div>
				</div>
				<HeaderSearchSlot placement="mobile-row" />
			</div>
		</div>
	);

	const bottomNav = showBottomNav ? (
		<div className="hidden md:block border-t border-b border-gray-200 bg-white">
			<div className="container-inner py-2 flex items-center gap-3">
				<CategoriesMenu menuItems={menuItems} />
				<nav className="flex items-center gap-3">
					{menuItems.map((item) => (
						<HeaderNavItem key={item.id} item={item} />
					))}
				</nav>
			</div>
		</div>
	) : null;

	return (
		<header
			className={cn(
				className,
				"w-full bg-white sticky top-0 z-50 shadow-xs safe-top",
				"[view-transition-name:site-header]",
			)}
		>
			{topBar}
			{mainRow}
			{bottomNav}
		</header>
	);
}

interface NavItemProps {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	href?: ComponentProps<typeof Link>["href"] | string;
}

function NavItem({ icon: Icon, label, href }: NavItemProps) {
	const content = (
		<>
			<Icon className="size-4 md:size-5" />
			<span className="text-xs md:text-sm">{label}</span>
		</>
	);

	const cls =
		"flex items-center gap-1 text-white hover:opacity-80 transition-opacity";

	if (href) {
		return (
			<Link href={href as ComponentProps<typeof Link>["href"]} className={cls}>
				{content}
			</Link>
		);
	}

	return <span className={cls}>{content}</span>;
}
