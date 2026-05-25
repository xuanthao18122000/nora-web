import {
	BookOpen,
	Boxes,
	LayoutDashboard,
	Link2,
	ScrollText,
	ShoppingCart,
	SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavSubItem {
	title: string;
	path: string;
}

export interface NavItem {
	title: string;
	path?: string;
	icon: LucideIcon;
	children?: NavSubItem[];
}

export interface NavGroup {
	name: string;
	items: NavItem[];
}

export const NAV_DATA: NavGroup[] = [
	{
		name: "Tổng quan",
		items: [{ title: "Dashboard", path: "/admin", icon: LayoutDashboard }],
	},
	{
		name: "Bán hàng",
		items: [
			{
				title: "Đơn hàng",
				icon: ShoppingCart,
				children: [
					{ title: "Danh sách đơn", path: "/admin/orders" },
					{ title: "Khách hàng", path: "/admin/customers" },
				],
			},
		],
	},
	{
		name: "Sản phẩm",
		items: [
			{
				title: "Catalog",
				icon: Boxes,
				children: [
					{ title: "Sản phẩm", path: "/admin/products" },
					{ title: "Danh mục", path: "/admin/categories" },
				],
			},
			{
				title: "Bộ lọc",
				path: "/admin/facets",
				icon: SlidersHorizontal,
			},
		],
	},
	{
		name: "Nội dung",
		items: [
			{
				title: "Bài viết",
				path: "/admin/posts",
				icon: BookOpen,
				children: [
					{ title: "Tất cả bài viết", path: "/admin/posts" },
					{ title: "Danh sách bài viết", path: "/admin/post-lists" },
				],
			},
			{
				title: "Quản lý trang",
				path: "/admin/pages",
				icon: ScrollText,
			},
		],
	},
	{
		name: "Hệ thống",
		items: [
			{
				title: "Slugs",
				path: "/admin/slugs",
				icon: Link2,
			},
		],
	},
];

