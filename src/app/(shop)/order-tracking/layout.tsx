import type { ReactNode } from "react";

export default function OrderTrackingLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="flex flex-col items-center bg-bg-page container-inner pb-8 pt-2 md:pt-4">
			<div className="flex w-full max-w-[800px] flex-col gap-2 md:gap-4">
				{children}
			</div>
		</div>
	);
}
