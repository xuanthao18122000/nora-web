"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/features/admin/ui";

/**
 * Catch-all 404 cho mọi path /admin/* không match.
 *
 * Trong Next.js App Router, file `not-found.tsx` ở root sẽ render với
 * root layout — kéo theo Header/Footer của storefront khi truy cập
 * `/admin/<route-không-tồn-tại>`. Dùng catch-all segment ở đây để
 * 404 admin render trong cụm `(admin)` (không có header/footer FE).
 */
export default function AdminNotFoundPage() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
			<div className="text-7xl font-bold tracking-tight text-gray-300">404</div>
			<h1 className="text-2xl font-bold text-gray-900">Không tìm thấy trang</h1>
			<p className="max-w-md text-sm text-gray-600">
				Đường dẫn bạn truy cập không tồn tại trong hệ thống quản trị.
			</p>
			<Link href="/admin">
				<Button>
					<Home className="h-4 w-4" />
					Về trang chủ admin
				</Button>
			</Link>
		</div>
	);
}
