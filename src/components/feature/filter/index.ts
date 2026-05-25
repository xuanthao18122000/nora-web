import { FacetGroup } from "./components/FacetGroup.client";
import { FilterChips } from "./components/FilterChips.client";
import { SortBy, SortByButton } from "./components/SortBy.client";
import { FilterInline } from "./views/FilterInline";
import { FilterSidebar } from "./views/FilterSidebar";

export const SearchFilter = {
	Root: FilterSidebar,
	Sidebar: FilterSidebar,
	Inline: FilterInline,
	Chips: FilterChips,
	FacetGroup: FacetGroup,
	SortBy,
	SortButton: SortByButton,
};

export {
	DEFAULT_SORT_OPTIONS,
	SortBy,
	SortByButton as SortButton,
	type SortOption,
} from "./components/SortBy.client";
export { SortProvider, useSortContext } from "./context/sort-provider.client";
export { SortByHead } from "./views/SortByHead.client";
