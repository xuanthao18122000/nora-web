"use client";

import { useAdminAuthStore } from "@/store/admin";

export default function AdminDashboardPage() {
	const user = useAdminAuthStore((s) => s.user);

	return (
		<div className="mx-auto max-w-4xl mt-4">
			<h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
			<p className="mt-1 text-sm text-gray-600">
				Chào {user?.fullName || "admin"} 👋. Đây là trang dashboard placeholder
				— các module sẽ được build dần.
			</p>

			<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<StatCard label="Sản phẩm" value="—" />
				<StatCard label="Đơn hàng" value="—" />
				<StatCard label="Khách hàng" value="—" />
			</div>
		</div>
	);
}

function StatCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
			<div className="text-sm font-medium text-gray-600">{label}</div>
			<div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
		</div>
	);
}
