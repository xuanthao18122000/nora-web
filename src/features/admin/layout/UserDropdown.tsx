"use client";

import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useClickOutside } from "@/features/admin/ui";
import { UserRoleEnum } from "@/lib/api/admin";
import { useAdminAuthStore } from "@/store/admin";

const ROLE_LABEL: Record<UserRoleEnum, string> = {
	[UserRoleEnum.ADMIN]: "Admin",
	[UserRoleEnum.SUPER_ADMIN]: "Super Admin",
};

export function UserDropdown() {
	const router = useRouter();
	const user = useAdminAuthStore((s) => s.user);
	const clearAuth = useAdminAuthStore((s) => s.clearAuth);

	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	useClickOutside(ref, open, () => setOpen(false));

	function handleLogout() {
		setOpen(false);
		clearAuth();
		router.replace("/admin/login");
	}

	const initials = user?.fullName
		? user.fullName
				.split(" ")
				.map((p) => p[0])
				.slice(-2)
				.join("")
				.toUpperCase()
		: "?";

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-gray-100"
			>
				<span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-semibold text-white">
					{initials}
				</span>
				<span className="hidden text-left md:block">
					<span className="block text-sm font-medium leading-tight text-gray-900">
						{user?.fullName || "—"}
					</span>
					<span className="block text-xs leading-tight text-gray-500">
						{user?.role ? ROLE_LABEL[user.role] : ""}
					</span>
				</span>
				<ChevronDown className="hidden h-4 w-4 text-gray-400 md:block" />
			</button>

			{open && (
				<div className="absolute right-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
					<div className="border-b border-gray-100 p-4">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-semibold text-white">
								{initials}
							</span>
							<div className="min-w-0 flex-1">
								<div className="truncate text-sm font-semibold text-gray-900">
									{user?.fullName || "—"}
								</div>
								<div className="truncate text-xs text-gray-500">{user?.email}</div>
							</div>
						</div>
					</div>

					<div className="py-1">
						<MenuLink href="/admin/profile" icon={User} onClick={() => setOpen(false)}>
							Hồ sơ cá nhân
						</MenuLink>
						<MenuLink href="/admin/settings" icon={Settings} onClick={() => setOpen(false)}>
							Cài đặt
						</MenuLink>
					</div>

					<div className="border-t border-gray-100 py-1">
						<button
							type="button"
							onClick={handleLogout}
							className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
						>
							<LogOut className="h-4 w-4" />
							Đăng xuất
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

function MenuLink({
	href,
	icon: Icon,
	children,
	onClick,
}: {
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
	onClick: () => void;
}) {
	return (
		<Link
			href={href}
			onClick={onClick}
			className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
		>
			<Icon className="h-4 w-4 text-gray-500" />
			{children}
		</Link>
	);
}
