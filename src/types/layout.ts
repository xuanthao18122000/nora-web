// ─── Layout Page API (/pages/layout) ───

export interface LayoutMenuChildItem {
	id: string;
	name: string;
	/** Prefix hiển thị trước name (vd "Địa chỉ"). Render `{title}: {name}` khi có. */
	title?: string | null;
	url: string | null;
	icon: string | null;
	status: number;
	price: number;
	minPrice?: number | null;
	listedPrice: number;
}

export interface LayoutMenuChildGroup {
	key: string;
	title: string;
	items: LayoutMenuChildItem[];
}

export interface LayoutMenuItem {
	id: number;
	name: string;
	position: number;
	data: {
		icon: string;
		children: LayoutMenuChildGroup[];
	};
	deviceType: string;
	targetUrl: string;
}

export interface LayoutSection {
	id: number;
	name: string;
	type: string;
	position: number;
	key?: string;
	extra?: Record<string, unknown>;
	items: unknown[];
}

export interface LayoutMenuSection extends Omit<LayoutSection, "items"> {
	key: "layout_menu";
	items: LayoutMenuItem[];
}

export interface PageLayoutData {
	id: string;
	title: string;
	slug: string;
	code: string;
	type: string;
	sections: LayoutSection[];
}
