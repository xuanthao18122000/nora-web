"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

import Button from "@/components/common/Button";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<section className="container-inner mt-10">
			<div className="rounded-2xl bg-white p-6">
				<h1 className="text-lg leading-lg font-semibold text-gray-900">
					Có lỗi xảy ra
				</h1>
				<p className="mt-1 text-sm leading-sm text-gray-600">
					Vui lòng thử lại hoặc quay về trang chủ.
				</p>

				<div className="mt-4 flex flex-col gap-2 sm:flex-row">
					<Button
						type="button"
						variant="bordered"
						color="gray"
						size="sm"
						onClick={() => reset()}
						className="w-full sm:w-auto"
					>
						Thử lại
					</Button>

					<Link href="/">
						<Button
							type="button"
							variant="filled"
							color="primary"
							size="sm"
							className="w-full sm:w-auto"
						>
							Về trang chủ
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
