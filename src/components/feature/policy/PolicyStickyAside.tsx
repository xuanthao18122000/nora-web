"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

const DEFAULT_HEADER_HEIGHT = 80;
const DESKTOP_GAP_PX = 16;

interface Props {
	children: ReactNode;
	className?: string;
}

export default function PolicyStickyAside({ children, className }: Props) {
	const [topOffset, setTopOffset] = useState<number>(
		DEFAULT_HEADER_HEIGHT + DESKTOP_GAP_PX,
	);
	const observerRef = useRef<ResizeObserver | null>(null);

	useEffect(() => {
		const header = document.querySelector<HTMLElement>(
			"header[class*='sticky']",
		);
		if (!header) return;

		const update = () => {
			const h = header.getBoundingClientRect().height;
			setTopOffset(h + DESKTOP_GAP_PX);
		};

		update();

		observerRef.current = new ResizeObserver(update);
		observerRef.current.observe(header);

		return () => observerRef.current?.disconnect();
	}, []);

	return (
		<div
			className={className}
			style={{
				position: "sticky",
				top: `${topOffset}px`,
				maxHeight: `calc(100vh - ${topOffset + DESKTOP_GAP_PX}px)`,
			}}
		>
			{children}
		</div>
	);
}
