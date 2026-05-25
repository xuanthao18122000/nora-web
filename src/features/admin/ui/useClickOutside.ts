"use client";

import { useEffect, type RefObject } from "react";

/**
 * Đóng dropdown / popover khi click ngoài ref hoặc nhấn Escape.
 */
export function useClickOutside(
	ref: RefObject<HTMLElement | null>,
	enabled: boolean,
	onClose: () => void,
) {
	useEffect(() => {
		if (!enabled) return;
		function handle(e: MouseEvent | KeyboardEvent) {
			if (e instanceof KeyboardEvent) {
				if (e.key === "Escape") onClose();
				return;
			}
			if (ref.current && !ref.current.contains(e.target as Node)) {
				onClose();
			}
		}
		document.addEventListener("mousedown", handle);
		document.addEventListener("keydown", handle);
		return () => {
			document.removeEventListener("mousedown", handle);
			document.removeEventListener("keydown", handle);
		};
	}, [ref, enabled, onClose]);
}
