"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button, useConfirm } from "@/features/admin/ui";
import {
	AdminApiError,
	ORDER_STATUS_LABEL,
	OrderStatusEnum,
	STATUS_TRANSITIONS,
	updateAdminOrderStatus,
} from "@/lib/api/admin";

interface StatusUpdaterProps {
	orderId: number;
	current: OrderStatusEnum;
	onUpdated: () => void;
}

const STATUS_VARIANT: Record<OrderStatusEnum, "primary" | "danger" | "secondary"> = {
	[OrderStatusEnum.NEW]: "primary",
	[OrderStatusEnum.CONFIRMED]: "primary",
	[OrderStatusEnum.SHIPPING]: "primary",
	[OrderStatusEnum.COMPLETED]: "primary",
	[OrderStatusEnum.CANCELLED]: "danger",
};

export function StatusUpdater({ orderId, current, onUpdated }: StatusUpdaterProps) {
	const confirm = useConfirm();
	const [submitting, setSubmitting] = useState<OrderStatusEnum | null>(null);

	const allowed = STATUS_TRANSITIONS[current];

	if (!allowed.length) {
		return (
			<p className="text-sm text-gray-500">
				Đơn ở trạng thái cuối — không thể thay đổi.
			</p>
		);
	}

	async function handleClick(target: OrderStatusEnum) {
		const ok = await confirm({
			title: "Cập nhật trạng thái",
			description: (
				<>
					Chuyển đơn sang <strong>{ORDER_STATUS_LABEL[target]}</strong>?
				</>
			),
			confirmText: "Xác nhận",
			tone: target === OrderStatusEnum.CANCELLED ? "danger" : "primary",
		});
		if (!ok) return;

		setSubmitting(target);
		try {
			await updateAdminOrderStatus(orderId, target);
			toast.success(`Đã chuyển sang ${ORDER_STATUS_LABEL[target]}`);
			onUpdated();
		} catch (err) {
			toast.error(
				err instanceof AdminApiError ? err.message : "Cập nhật trạng thái thất bại",
			);
		} finally {
			setSubmitting(null);
		}
	}

	return (
		<div className="space-y-2">
			<div className="text-xs font-medium uppercase tracking-wider text-gray-500">
				Hành động
			</div>
			<div className="flex flex-col gap-2">
				{allowed.map((target) => (
					<Button
						key={target}
						variant={STATUS_VARIANT[target]}
						onClick={() => handleClick(target)}
						disabled={submitting !== null}
						className="w-full"
					>
						{submitting === target
							? "Đang cập nhật..."
							: `Chuyển sang ${ORDER_STATUS_LABEL[target]}`}
					</Button>
				))}
			</div>
		</div>
	);
}
