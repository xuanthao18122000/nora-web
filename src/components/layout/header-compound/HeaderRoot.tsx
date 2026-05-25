import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type HeaderRootProps = {
	children: ReactNode;
	className?: string;
};

export function HeaderRoot({ children, className }: HeaderRootProps) {
	return (
		<header className={cn("w-full bg-white", className)}>{children}</header>
	);
}
