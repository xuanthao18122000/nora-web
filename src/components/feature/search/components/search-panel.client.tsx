"use client";

import { type ReactNode, use } from "react";

import { Backdrop } from "@/components/common/Backdrop";
import { Popover } from "@/components/common/Popover";

import { SearchContext } from "../context/search-provider.client";

const PANEL_MAX_HEIGHT = "80vh";

export function SearchPanel({ children }: { children: ReactNode }) {
	const ctx = use(SearchContext);
	const isOpen = ctx?.state.isOpen ?? false;

	return (
		<>
			<Backdrop open={isOpen} lockScroll={true} className="z-45" />
			<Popover.Content
				align="start"
				sideOffset={4}
				className="search-panel overflow-auto overflow-x-hidden rounded-xl md:rounded-2xl border border-gray-200 bg-white p-0 shadow-[0px_3px_16px_rgba(0,0,0,0.12)]"
				style={{
					maxHeight: PANEL_MAX_HEIGHT,
				}}
				onOpenAutoFocus={(e) => e.preventDefault()}
				aria-label="Kết quả tìm kiếm"
			>
				<h2 className="sr-only">Tìm kiếm</h2>
				{children}
			</Popover.Content>
		</>
	);
}
