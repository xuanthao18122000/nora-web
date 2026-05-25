"use client";

import Button from "@/components/common/Button";

import CodeSnippet from "../CodeSnippet";

export default function DesignSystemButtonPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">Button</h1>
			<p className="text-gray-600 mb-8">
				Primary actions and controls. Use design tokens from
				globals.css.
			</p>

			<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
				Filled
			</h3>
			<div className="flex items-center gap-3 mb-6 flex-wrap">
				<Button variant="filled" color="primary" size="md">
					Đăng nhập
				</Button>
				<Button variant="filled" color="primary" size="sm">
					Mua ngay
				</Button>
				<Button variant="filled" color="primary" size="xs">
					Mua ngay
				</Button>
				<Button variant="filled" color="primary" size="md" loading>
					Loading
				</Button>
				<Button variant="filled" color="primary" size="md" disabled>
					Disabled
				</Button>
			</div>

			<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
				Bordered
			</h3>
			<div className="flex items-center gap-3 mb-6 flex-wrap">
				<Button variant="bordered" color="gray" size="md">
					Tạo tài khoản
				</Button>
				<Button variant="bordered" color="gray" size="sm">
					Xem thêm sản phẩm
				</Button>
				<Button variant="bordered" color="primary" size="md">
					Primary Bordered
				</Button>
			</div>

			<h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
				Soft
			</h3>
			<div className="flex items-center gap-3 flex-wrap">
				<Button variant="soft" color="primary" size="xs">
					Mua ngay
				</Button>
				<Button variant="soft" color="primary" size="sm">
					Soft Primary SM
				</Button>
				<Button variant="soft" color="gray" size="sm">
					Soft Gray
				</Button>
			</div>
			<CodeSnippet
				code={`import { Button } from "@/components/common";

<Button variant="primary">Mua ngay</Button>
<Button variant="secondary">Xem thêm</Button>
<Button variant="outline">Hủy</Button>
<Button variant="ghost">Tìm hiểu</Button>
<Button size="sm">Nhỏ</Button>
<Button size="lg" fullWidth>Toàn chiều rộng</Button>
<Button disabled>Vô hiệu hóa</Button>`}
			/>
		</div>
	);
}
