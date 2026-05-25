"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import { NAV_DATA } from "./nav-data";
import { NavItem } from "./NavItem";

export function AdminSidebar() {
	return (
		<aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
			{/* Brand */}
			<div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-4">
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
					<Zap className="h-5 w-5" fill="currentColor" />
				</div>
				<Link
					href="/admin"
					className="text-lg font-bold tracking-tight text-gray-900"
				>
					Acquy HN
				</Link>
			</div>

			{/* Navigation */}
			<nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
				{NAV_DATA.flatMap((group) => group.items).map((item) => (
					<NavItem key={item.title} item={item} />
				))}
			</nav>
		</aside>
	);
}
