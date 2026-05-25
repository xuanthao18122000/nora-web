"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface PostListSearchProps {
	defaultValue?: string;
	placeholder?: string;
}

export default function PostListSearch({
	defaultValue = "",
	placeholder = "Tìm theo tiêu đề, mô tả hoặc nội dung…",
}: PostListSearchProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [value, setValue] = useState(defaultValue);

	const submit = (next: string) => {
		const params = new URLSearchParams(searchParams.toString());
		const term = next.trim();
		if (term) params.set("q", term);
		else params.delete("q");
		params.delete("page");
		const qs = params.toString();
		router.push(qs ? `${pathname}?${qs}` : pathname);
	};

	return (
		<form
			role="search"
			onSubmit={(e) => {
				e.preventDefault();
				submit(value);
			}}
			className="relative w-full"
		>
			<Search
				className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
				aria-hidden="true"
			/>
			<input
				type="search"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder={placeholder}
				aria-label="Tìm kiếm bài viết"
				className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-9 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
			/>
			{value && (
				<button
					type="button"
					aria-label="Xóa tìm kiếm"
					onClick={() => {
						setValue("");
						submit("");
					}}
					className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
				>
					<X className="size-4" />
				</button>
			)}
		</form>
	);
}
