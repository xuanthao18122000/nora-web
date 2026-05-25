import {
	Clock,
	FileSearch,
	House,
	Phone,
	Truck,
} from "lucide-react";
import Link from "next/link";
import { CONTACT } from "@/lib/constants/site-info";

type NavItemProps = {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	href?: string;
};

function NavItem({ icon: Icon, label, href }: NavItemProps) {
	const className =
		"flex items-center gap-1 text-sm text-white hover:opacity-80 transition-opacity";

	if (href) {
		return (
			<Link href={href} className={className}>
				<Icon className="size-5" />
				<span>{label}</span>
			</Link>
		);
	}

	return (
		<span className={className}>
			<Icon className="size-5" />
			<span>{label}</span>
		</span>
	);
}

const LEFT_NAV_ITEMS = [
	{ icon: Phone, label: CONTACT.hotlineDisplay },
	{ icon: Clock, label: "Mở cửa 24/7" },
	{ icon: Truck, label: "Tư vấn & khảo sát tận nơi" },
] satisfies readonly NavItemProps[];

const RIGHT_NAV_ITEMS = [
	{ icon: House, label: "Cửa hàng", href: "/cua-hang" },
	{ icon: FileSearch, label: "Tra cứu đơn hàng", href: "/order-tracking" },
] as const satisfies readonly NavItemProps[];

export function HeaderTopBar() {
	return (
		<div className="bg-primary-600 safe-top">
			<div className="container-inner py-2 flex items-center justify-between">
				<div className="flex items-center gap-3">
					{LEFT_NAV_ITEMS.map(({ icon, label }) => (
						<NavItem key={label} icon={icon} label={label} />
					))}
				</div>
				<div className="flex items-center gap-3">
					{RIGHT_NAV_ITEMS.map(({ icon, label, href }) => (
						<NavItem
							key={label}
							icon={icon}
							label={label}
							href={href}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
