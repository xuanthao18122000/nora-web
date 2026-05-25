import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center bg-gray-100 px-4">
			<div className="relative w-full max-w-xl aspect-square -mt-16">
				<Image
					src="/404.webp"
					alt="Trang không tồn tại"
					fill
					sizes="(max-width: 640px) 90vw, 576px"
					className="object-contain"
					priority
				/>
			</div>
			<p className="-mt-30 text-lg font-medium text-gray-900">
				Trang không tồn tại
			</p>
			<p className="mt-1 text-sm text-gray-500 text-center">
				Trang bạn tìm kiếm có thể đã bị xóa hoặc đường dẫn không đúng.
			</p>
			<Link
				href="/"
				className="mt-4 mb-16 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
			>
				Về trang chủ
			</Link>
		</div>
	);
}
