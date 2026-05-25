import { AdminAuthGuard } from "@/features/admin/auth/AdminAuthGuard";
import { AdminHeader } from "@/features/admin/layout/AdminHeader";
import { AdminSidebar } from "@/features/admin/layout/AdminSidebar";
import { ConfirmProvider } from "@/features/admin/ui";

/**
 * Layout cho dashboard admin — yêu cầu đã đăng nhập.
 * Wrap mọi route /admin/* (trừ /admin/login).
 */
export default function AdminDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AdminAuthGuard>
			<ConfirmProvider>
				<div className="flex h-screen overflow-hidden">
					<AdminSidebar />
					<div className="flex flex-1 flex-col overflow-hidden">
						<AdminHeader />
						<main className="flex-1 overflow-y-auto px-6 pb-6">{children}</main>
					</div>
				</div>
			</ConfirmProvider>
		</AdminAuthGuard>
	);
}
