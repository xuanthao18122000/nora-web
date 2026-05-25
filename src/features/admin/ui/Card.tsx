import type { HTMLAttributes } from "react";

export function Card({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...rest}
			className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
		/>
	);
}

export function CardHeader({
	title,
	count,
	actions,
}: {
	title: string;
	count?: number;
	actions?: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
			<h2 className="text-base font-semibold text-gray-900 md:text-lg">
				{title}
				{count !== undefined && (
					<span className="ml-2 text-sm font-normal text-gray-500">
						({count})
					</span>
				)}
			</h2>
			{actions && <div className="flex items-center gap-2">{actions}</div>}
		</div>
	);
}

export function CardBody({
	className = "",
	...rest
}: HTMLAttributes<HTMLDivElement>) {
	return <div {...rest} className={`p-5 ${className}`} />;
}
