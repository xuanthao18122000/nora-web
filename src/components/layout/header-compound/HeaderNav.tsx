import {
	Headphones,
	Laptop,
	Menu,
	Smartphone,
	Tablet,
	Watch,
} from "lucide-react";
import Link from "next/link";
import { toHref } from "@/lib/utils/href";

type MenuItem = {
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	slug: string;
};

const MENU_ITEMS: readonly MenuItem[] = [
	{ label: "Điện thoại", icon: Smartphone, slug: "dien-thoai" },
	{ label: "Laptop", icon: Laptop, slug: "laptop" },
	{ label: "Tablet", icon: Tablet, slug: "tablet" },
	{ label: "Đồng hồ", icon: Watch, slug: "dong-ho" },
	{ label: "Âm thanh", icon: Headphones, slug: "am-thanh" },
];

export function HeaderNav() {
	return (
		<div className="border-b border-gray-200 bg-white">
			<div className="container-inner py-2 flex items-center gap-3">
				<button
					type="button"
					className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
				>
					<Menu className="size-5" />
					<span>Danh mục</span>
				</button>

				<nav className="flex items-center gap-3">
					{MENU_ITEMS.map(({ label, icon: Icon, slug }) => (
						<Link
							key={label}
							href={toHref(slug)}
							className="flex items-center gap-1 px-1.5 py-1.5 text-sm text-gray-900 hover:text-blue-500 transition-colors"
						>
							<Icon className="size-5" />
							<span>{label}</span>
						</Link>
					))}
				</nav>
			</div>
		</div>
	);
}
