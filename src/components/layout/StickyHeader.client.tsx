/**
 * Pure CSS sticky header — no JS, no CLS.
 * Top bar scrolls away, main row + bottom nav stick at top.
 */
export function StickyHeader({
	className,
	topBar,
	bottomNav,
	children,
}: {
	className?: string;
	topBar?: React.ReactNode;
	bottomNav?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className={className}>
			{/* Top bar — not sticky, scrolls away */}
			{topBar}

			{/* Main row + bottom nav — sticky */}
			<header className="sticky top-0 z-50 bg-white shadow-sm">
				{children}
				{bottomNav}
			</header>
		</div>
	);
}
