import { HeaderSearchSlot } from "@/components/feature/search/header-search-slot";
import { HeaderActions } from "./HeaderActions.client";
import { HeaderMain } from "./HeaderMain";
import { HeaderNav } from "./HeaderNav";
import { HeaderRoot } from "./HeaderRoot";
import { HeaderTopBar } from "./HeaderTopBar";

export const Header = {
	Root: HeaderRoot,
	TopBar: HeaderTopBar,
	Main: HeaderMain,
	Nav: HeaderNav,
	Search: HeaderSearchSlot,
	Actions: HeaderActions,
};

export { HeaderSearchSlot as HeaderSearch } from "@/components/feature/search/header-search-slot";
export { HeaderActions } from "./HeaderActions.client";
export { HeaderMain } from "./HeaderMain";
export { HeaderNav } from "./HeaderNav";
export { HeaderRoot } from "./HeaderRoot";
export { HeaderTopBar } from "./HeaderTopBar";
