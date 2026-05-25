export default function RadiusShadowsPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">
				Border Radius & Shadows
			</h1>
			<p className="text-gray-600 mb-8">
				Token-based radius and shadow utilities. Use Tailwind classes
				from globals.css.
			</p>
			<section aria-labelledby="radius-heading" className="mb-8">
				<h2
					id="radius-heading"
					className="text-lg font-semibold text-gray-900 mb-4"
				>
					Border radius
				</h2>
				<div className="flex items-center gap-6 flex-wrap">
					<div className="flex flex-col items-center gap-2">
						<div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-xs" />
						<span className="text-xs text-gray-500">
							rounded-xs (4px)
						</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-lg" />
						<span className="text-xs text-gray-500">
							rounded-lg (8px)
						</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-lg" />
						<span className="text-xs text-gray-500">
							rounded-lg (16px)
						</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-full" />
						<span className="text-xs text-gray-500">
							rounded-full
						</span>
					</div>
				</div>
			</section>
			<section aria-labelledby="shadows-heading">
				<h2
					id="shadows-heading"
					className="text-lg font-semibold text-gray-900 mb-4"
				>
					Shadows
				</h2>
				<div className="flex items-center gap-6 flex-wrap">
					<div className="flex flex-col items-center gap-2">
						<div className="w-20 h-20 bg-white rounded-lg shadow-(--shadow-sm)" />
						<span className="text-xs text-gray-500">shadow-sm</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<div className="w-20 h-20 bg-white rounded-lg shadow-(--shadow-card)" />
						<span className="text-xs text-gray-500">
							shadow-card
						</span>
					</div>
				</div>
			</section>
		</div>
	);
}
