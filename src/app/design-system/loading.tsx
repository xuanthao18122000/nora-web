export default function DesignSystemLoading() {
	return (
		<div className="animate-pulse rounded-lg border border-gray-200 bg-white p-8">
			<div className="mb-4 h-8 w-48 rounded bg-gray-200" />
			<div className="space-y-2">
				<div className="h-4 w-full rounded bg-gray-100" />
				<div className="h-4 w-3/4 rounded bg-gray-100" aria-hidden />
				<div className="h-4 w-1/2 rounded bg-gray-100" aria-hidden />
			</div>
		</div>
	);
}
