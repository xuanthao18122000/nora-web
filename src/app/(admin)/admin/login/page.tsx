import type { Metadata } from "next";
import { LoginForm } from "@/features/admin/auth/LoginForm";

export const metadata: Metadata = {
	title: "Đăng nhập — Admin",
};

export default function AdminLoginPage() {
	return (
		<main className="flex min-h-screen items-center justify-center px-4 py-12">
			<div className="w-full max-w-sm">
				<div className="mb-8 text-center">
					<h1 className="text-2xl font-bold tracking-tight text-gray-900">
						Acquy HN — Admin
					</h1>
					<p className="mt-2 text-sm text-gray-600">
						Đăng nhập để truy cập hệ thống quản trị
					</p>
				</div>
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<LoginForm />
				</div>
			</div>
		</main>
	);
}
