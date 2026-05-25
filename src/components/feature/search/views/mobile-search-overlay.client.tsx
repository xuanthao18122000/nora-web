"use client";

import { ArrowLeft } from "lucide-react";
import { type ReactNode, use } from "react";

import { Button } from "@/components/common/Button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/common/Drawer";
import {
	useKeyboardAwareHeight,
	useKeyboardInset,
} from "@/lib/hooks/useKeyboardAwareHeight";

import { SearchInput } from "../components/search-input.client";
import { SearchContext } from "../context/search-provider.client";
import { SearchInitialSlot } from "./search-initial-slot.client";
import { SearchResults } from "./search-results.client";

interface MobileSearchOverlayProps {
	initialContent: ReactNode;
}

export function MobileSearchOverlay({
	initialContent,
}: MobileSearchOverlayProps) {
	const ctx = use(SearchContext);
	// Lock height = chiều cao viewport lúc chưa có bàn phím. Khi bàn phím mở,
	// 100dvh sẽ co lại → drawer bị đẩy lên top; dùng max-height ổn định để
	// drawer giữ nguyên, chỉ phần body bên trong scroll lên/xuống dưới input.
	const lockedHeight = useKeyboardAwareHeight(ctx?.state.isOpen ?? false);

	if (!ctx) return null;

	const { state, actions } = ctx;

	return (
		<Drawer
			open={state.isOpen}
			onOpenChange={actions.setOpen}
			direction="bottom"
		>
			<DrawerContent
				className="fixed inset-x-0 top-0 z-200 flex flex-col bg-white outline-none"
				style={{
					height: lockedHeight != null ? `${lockedHeight}px` : "100dvh",
				}}
				aria-describedby={undefined}
			>
				<DrawerTitle className="sr-only">Tìm kiếm</DrawerTitle>

				<div
					className="shrink-0 flex items-center gap-1 px-2 bg-white border-b border-gray-100"
					style={{
						paddingTop: "max(env(safe-area-inset-top, 10px), 10px)",
						paddingBottom: "10px",
					}}
				>
					<Button
						variant="link"
						color="gray"
						onClick={actions.close}
						aria-label="Quay lại"
						className="shrink-0 p-1.5 -ml-1 rounded-full text-gray-500 active:bg-gray-100"
					>
						<ArrowLeft className="size-5" />
					</Button>

					<div className="flex-1 min-w-0">
						<SearchInput
							placeholder="Nhập tên ắc quy, ô tô, xe máy..."
							autoFocus={true}
						/>
					</div>
				</div>

				<MobileSearchBody>
					<SearchInitialSlot>{initialContent}</SearchInitialSlot>
					<SearchResults />
				</MobileSearchBody>
			</DrawerContent>
		</Drawer>
	);
}

function MobileSearchBody({ children }: { children: ReactNode }) {
	const keyboardInset = useKeyboardInset();

	return (
		<div
			className="flex-1 overflow-y-auto bg-white overscroll-contain"
			style={{
				paddingBottom: keyboardInset > 0 ? keyboardInset : undefined,
			}}
		>
			{children}
		</div>
	);
}
