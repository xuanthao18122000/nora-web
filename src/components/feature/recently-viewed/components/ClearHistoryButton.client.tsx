"use client";

import { useState } from "react";
import { ConfirmDrawer } from "@/components/common/ConfirmDrawer";

interface ClearHistoryButtonProps {
	onClear: () => void;
}

export function ClearHistoryButton({ onClear }: ClearHistoryButtonProps) {
	const [showConfirm, setShowConfirm] = useState(false);

	return (
		<>
			<button
				type="button"
				className="text-sm font-medium text-(--color-text-muted) transition-colors hover:text-(--color-text-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
				onClick={() => setShowConfirm(true)}
				aria-label="Xoá toàn bộ lịch sử sản phẩm đã xem"
			>
				Xoá lịch sử
			</button>

			<ConfirmDrawer
				open={showConfirm}
				onClose={() => setShowConfirm(false)}
				title="Xoá lịch sử đã xem"
				description="Bạn có chắc muốn xoá toàn bộ lịch sử sản phẩm đã xem?"
				confirmText="Xoá tất cả"
				cancelText="Huỷ"
				onConfirm={onClear}
			/>
		</>
	);
}
