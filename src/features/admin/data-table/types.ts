import type { ReactNode } from "react";

export type FilterFieldType = "text" | "select" | "dateRange";

export interface FilterFieldOption {
	value: string | number;
	label: string;
}

export interface FilterField {
	id: string;
	label: string;
	type: FilterFieldType;
	placeholder?: string;
	options?: FilterFieldOption[];
	/**
	 * Khi `type=dateRange`, có thể override key xuất ra khi apply filter.
	 * Mặc định backend nhận `<id>From` và `<id>To` (vd `createdAtFrom`, `createdAtTo`).
	 */
	rangeKey?: { from: string; to: string };
}

export type FilterValue = Record<string, string | number | { from: string; to: string }>;

/** Column config cho DataTable. */
export interface DataTableColumn<T> {
	id: string;
	header: ReactNode;
	/** Render cell — fallback `(row[id])` nếu không truyền. */
	cell?: (row: T) => ReactNode;
	className?: string;
	headerClassName?: string;
	/** Cố định width column (vd "120px" hoặc "10rem"). */
	width?: string;
	/** Align text — default left. */
	align?: "left" | "right" | "center";
}
