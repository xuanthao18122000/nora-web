"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dropdown, DropdownItem } from "./Dropdown";

interface ActionMenuItem {
	label: string;
	icon?: React.ReactNode;
	onClick: () => void;
	danger?: boolean;
}

interface ActionMenuProps {
	/** Path để chuyển hướng khi click "Chỉnh sửa". Bỏ qua nếu không cần. */
	editHref?: string;
	/** Hàm xoá. Bỏ qua nếu không cần. */
	onDelete?: () => void;
	/** Action bổ sung (chèn giữa Edit và Delete). */
	extra?: ActionMenuItem[];
}

/**
 * Kebab menu dùng chung cho cột "Thao tác" trong các bảng admin.
 * Mặc định có "Chỉnh sửa" + "Xoá", có thể thêm action tuỳ ý qua `extra`.
 */
export function ActionMenu({ editHref, onDelete, extra }: ActionMenuProps) {
	const router = useRouter();

	return (
		<div className="flex justify-center">
			<Dropdown
				trigger={
					<button
						type="button"
						className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
						aria-label="Thao tác"
					>
						<MoreVertical className="h-4 w-4" />
					</button>
				}
			>
				{(close) => (
					<>
						{editHref && (
							<DropdownItem
								onClick={() => {
									router.push(editHref);
									close();
								}}
							>
								<span className="inline-flex items-center gap-2">
									<Pencil className="h-3.5 w-3.5" />
									Chỉnh sửa
								</span>
							</DropdownItem>
						)}
						{extra?.map((item) => (
							<DropdownItem
								key={item.label}
								onClick={() => {
									item.onClick();
									close();
								}}
							>
								<span
									className={`inline-flex items-center gap-2 ${item.danger ? "text-red-600" : ""}`}
								>
									{item.icon}
									{item.label}
								</span>
							</DropdownItem>
						))}
						{onDelete && (
							<DropdownItem
								onClick={() => {
									close();
									onDelete();
								}}
							>
								<span className="inline-flex items-center gap-2 text-red-600">
									<Trash2 className="h-3.5 w-3.5" />
									Xoá
								</span>
							</DropdownItem>
						)}
					</>
				)}
			</Dropdown>
		</div>
	);
}
