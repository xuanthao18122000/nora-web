"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";

export default function SatisfactionCard({
	className,
}: {
	className?: string;
}) {
	const [selected, setSelected] = useState<"yes" | "no" | null>(null);

	const handleSelect = (value: "yes" | "no") => {
		setSelected(value);
		// TODO: call API to submit feedback
	};

	return (
		<section
			className={cn(
				"flex flex-col items-center gap-4 rounded-2xl bg-white p-6",
				className,
			)}
		>
			<h2 className="text-xl font-semibold leading-7 text-gray-900 text-center">
				Bạn có hài lòng với trải nghiệm này không?
			</h2>

			{selected ? (
				<p className="text-sm text-gray-600">Cảm ơn bạn đã phản hồi!</p>
			) : (
				<div className="flex items-center gap-3">
					<Button
						variant="bordered"
						color="primary"
						size="sm"
						onClick={() => handleSelect("yes")}
						leadingIcon={
							<ThumbsUp className="size-4" aria-hidden="true" />
						}
					>
						Hài lòng
					</Button>
					<Button
						variant="bordered"
						color="primary"
						size="sm"
						onClick={() => handleSelect("no")}
						leadingIcon={
							<ThumbsDown className="size-4" aria-hidden="true" />
						}
					>
						Không hài lòng
					</Button>
				</div>
			)}
		</section>
	);
}
