"use client";

import { ChevronRight, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { SimpleProductDetail } from "@/types/simple-product";

interface SpecRow {
	icon: LucideIcon;
	iconColor: string;
	label: string;
	value: string;
}

interface ProductSpecsSummaryProps {
	product: SimpleProductDetail;
}

export default function ProductSpecsSummary({ product }: ProductSpecsSummaryProps) {
	const rows: SpecRow[] = [];

	// Bảo hành (mặc định 09 tháng — có thể dùng từ field tương lai)
	rows.push({
		icon: ShieldCheck,
		iconColor: "text-orange-500",
		label: "Bảo hành",
		value: "09 tháng chính hãng",
	});

	if (product.origin) {
		rows.push({
			icon: ShieldCheck,
			iconColor: "text-blue-500",
			label: "Xuất xứ",
			value: product.origin,
		});
	}

	rows.push({
		icon: Truck,
		iconColor: "text-orange-500",
		label: "Giao hàng",
		value: "Toàn quốc",
	});

	if (rows.length === 0) return null;

	return (
		<div className="rounded-lg bg-white p-4">
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-base font-semibold text-gray-900">
					Thông số kỹ thuật
				</h2>
				{product.description && (
					<Link
						href="#mo-ta"
						className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
					>
						Xem tất cả
						<ChevronRight className="size-4" />
					</Link>
				)}
			</div>

			<dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
				{rows.map(({ icon: Icon, iconColor, label, value }) => (
					<div key={label} className="flex items-start gap-2.5">
						<Icon className={`size-5 shrink-0 mt-0.5 ${iconColor}`} />
						<div className="min-w-0">
							<dt className="text-xs text-gray-500">{label}</dt>
							<dd className="text-sm font-medium text-gray-900 truncate">
								{value}
							</dd>
						</div>
					</div>
				))}
			</dl>
		</div>
	);
}
