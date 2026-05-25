import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type HeaderMainProps = {
	children?: ReactNode;
};

export function HeaderMain({ children }: HeaderMainProps) {
	return (
		<div className="border-b border-gray-200 bg-white safe-top">
			<div className="container-inner py-3 flex items-center gap-2 sm:gap-4">
				<Link
					href="/"
					className="shrink-0 hover:opacity-80 transition-opacity"
				>
					<Image
						src="/logo.jpg"
						alt="Ắc Quy HN Sài Gòn"
						width={120}
						height={30}
						priority
						className="w-[90px] sm:w-[120px] h-auto bg-transparent"
						unoptimized
					/>
				</Link>

				{children}
			</div>
		</div>
	);
}
