"use client";

import { CircleMinus, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { type CompareItem, useCompareStore } from "@/store/useCompareStore";

interface CompareButtonProps {
	product: CompareItem;
	className?: string;
}

export default function CompareButton({
	product,
	className,
}: CompareButtonProps) {
	const { items, addItem, removeItem } = useCompareStore();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isActive = mounted
		? items.some((i) => i !== null && i.productId === product.productId)
		: false;

	const handleClick = () => {
		if (isActive) {
			removeItem(product.productId);
			return;
		}

		const result = addItem(product);
		if (!result.success) {
			if (result.error === "MAX_REACHED") {
				toast.error("Tối đa 3 sản phẩm so sánh");
			} else if (result.error === "WRONG_CATEGORY") {
				toast.error("Chỉ so sánh sản phẩm cùng danh mục");
			}
		}
	};

	const Icon = isActive ? CircleMinus : CirclePlus;

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"flex cursor-pointer items-center gap-1 rounded-lg text-sm font-medium leading-5 text-blue-600 transition-colors hover:text-blue-700",
				isActive && "text-blue-700",
				className,
			)}
			title={isActive ? "Xóa khỏi so sánh" : "Thêm vào so sánh"}
		>
			<Icon aria-hidden size={20} />
			<span>So sánh</span>
		</button>
	);
}
