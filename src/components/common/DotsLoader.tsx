import { cn } from "@/lib/utils/cn";

interface DotsLoaderProps {
	className?: string;
}

export function DotsLoader({ className }: DotsLoaderProps) {
	return (
		<span
			className={cn("inline-flex tracking-widest text-[20px]", className)}
		>
			<span className="animate-bounce" style={{ animationDelay: "0ms" }}>
				·
			</span>
			<span
				className="animate-bounce"
				style={{ animationDelay: "150ms" }}
			>
				·
			</span>
			<span
				className="animate-bounce"
				style={{ animationDelay: "300ms" }}
			>
				·
			</span>
		</span>
	);
}
