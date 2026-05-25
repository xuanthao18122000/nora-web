"use client";

import { Search } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { UserDropdown } from "./UserDropdown";

export function AdminHeader() {
	return (
		<header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-6">
			{/* Search */}
			<div className="relative flex-1 max-w-md">
				<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					placeholder="Tìm kiếm..."
					className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
				/>
			</div>

			{/* Right section */}
			<div className="ml-auto flex items-center gap-2">
				<NotificationDropdown />
				<div className="mx-1 h-6 w-px bg-gray-200" />
				<UserDropdown />
			</div>
		</header>
	);
}
