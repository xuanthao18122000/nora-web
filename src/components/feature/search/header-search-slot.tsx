import { Suspense } from "react";

import SearchInput from "@/components/common/SearchInput";
import { isMobileUA } from "@/lib/utils/device";

import { getSearchInitialData } from "./api/get-search-initial";
import { HeaderSearchDesktop } from "./views/header-search-desktop.client";
import { HeaderSearchMobile } from "./views/header-search-mobile.client";
import { SearchInitialContent } from "./views/search-initial-content";

type Placement = "inline" | "mobile-row";

interface HeaderSearchSlotProps {
	placement: Placement;
}

const fallback = (
	<SearchInput
		placeholder="Bạn muốn mua gì hôm nay"
		className="flex-1 min-w-0"
		readOnly
	/>
);

export async function HeaderSearchSlot({ placement }: HeaderSearchSlotProps) {
	const isMobile = await isMobileUA();

	if (placement === "inline" && isMobile) return null;
	if (placement === "mobile-row" && !isMobile) return null;

	const initialData = await getSearchInitialData();
	const initialContent = <SearchInitialContent initialData={initialData} />;

	if (placement === "inline") {
		return (
			<div className="flex flex-1 min-w-0">
				<Suspense fallback={fallback}>
					<HeaderSearchDesktop initialContent={initialContent} />
				</Suspense>
			</div>
		);
	}

	return (
		<div className="bg-white">
			<Suspense fallback={fallback}>
				<HeaderSearchMobile initialContent={initialContent} />
			</Suspense>
		</div>
	);
}
