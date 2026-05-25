"use client";

import type { ReactNode } from "react";

/**
 * Account routes đã bị xoá ở shop acquyhn → không còn pathname nào cần ẩn header.
 * Giữ component để không phá layout import; pass-through hoàn toàn.
 */
export function HeaderMobileGate({ children }: { children: ReactNode }) {
	return <div className="contents">{children}</div>;
}
