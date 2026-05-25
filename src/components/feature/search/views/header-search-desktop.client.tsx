"use client";

import { type ReactNode, use } from "react";

import { Popover } from "@/components/common/Popover";

import { SearchInput } from "../components/search-input.client";
import { SearchPanel } from "../components/search-panel.client";
import {
	SearchContext,
	SearchProvider,
} from "../context/search-provider.client";
import { SearchInitialSlot } from "./search-initial-slot.client";
import { SearchResults } from "./search-results.client";

interface HeaderSearchDesktopProps {
	initialContent: ReactNode;
}

function DesktopShell({ initialContent }: HeaderSearchDesktopProps) {
	const ctx = use(SearchContext);
	if (!ctx) return null;

	const { state, actions } = ctx;

	return (
		<Popover.Root open={state.isOpen} onOpenChange={actions.setOpen}>
			<Popover.Anchor asChild>
				<div className="w-full">
					<SearchInput placeholder="Bạn muốn mua gì hôm nay" />
				</div>
			</Popover.Anchor>
			<SearchPanel>
				<SearchInitialSlot>{initialContent}</SearchInitialSlot>
				<SearchResults />
			</SearchPanel>
		</Popover.Root>
	);
}

export function HeaderSearchDesktop({
	initialContent,
}: HeaderSearchDesktopProps) {
	return (
		<SearchProvider>
			<DesktopShell initialContent={initialContent} />
		</SearchProvider>
	);
}
