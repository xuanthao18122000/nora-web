"use client";

import { useId } from "react";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerTitle,
} from "@/components/common/Drawer";

interface ConfirmDrawerProps {
	open: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
}

export function ConfirmDrawer({
	open,
	onClose,
	title,
	description,
	confirmText = "Xác nhận",
	cancelText = "Huỷ",
	onConfirm,
}: ConfirmDrawerProps) {
	const descriptionId = useId();

	return (
		<Drawer
			open={open}
			direction="bottom"
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DrawerContent
				className="fixed inset-0 z-60 flex items-center justify-center p-4"
				aria-describedby={description ? descriptionId : undefined}
				aria-modal="true"
			>
				<div className="w-full max-w-[420px] rounded-xl md:rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.18)]">
					<div className="px-2 md:px-4 py-4">
						<DrawerTitle className="text-base font-semibold text-text-primary">
							{title}
						</DrawerTitle>
						{description && (
							<p
								id={descriptionId}
								className="mt-1 text-sm text-gray-500"
							>
								{description}
							</p>
						)}
					</div>

					<DrawerFooter className="flex gap-2 px-4 pb-4 pt-0">
						<button
							type="button"
							className="h-11 flex-1 rounded-lg border border-gray-200 bg-white text-sm font-medium text-text-primary transition-colors hover:bg-gray-100"
							onClick={onClose}
						>
							{cancelText}
						</button>
						<button
							type="button"
							className="h-11 flex-1 rounded-lg bg-primary-500 text-sm font-medium text-white transition-opacity hover:opacity-90"
							onClick={() => {
								onConfirm();
								onClose();
							}}
						>
							{confirmText}
						</button>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
