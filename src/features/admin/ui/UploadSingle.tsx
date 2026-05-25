"use client";

import { ImagePlus, Link2, Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	type AdminFileUploadResponse,
	uploadAdminFile,
} from "@/lib/api/admin";
import { getImageUrl } from "@/lib/utils/image";

interface UploadSingleProps {
	value?: string | null;
	onChange: (path: string | null) => void;
	disabled?: boolean;
	/** MIME types accept, vd `image/*`. Default: image */
	accept?: string;
	/** Tối đa MB. Default 5 */
	maxSizeMB?: number;
	className?: string;
	/** Cho phép paste link ảnh. Default true. */
	allowUrl?: boolean;
}

function isHttpUrl(s: string) {
	const t = s.trim();
	return /^https?:\/\//i.test(t);
}

export function UploadSingle({
	value,
	onChange,
	disabled,
	accept = "image/*",
	maxSizeMB = 5,
	className = "",
	allowUrl = true,
}: UploadSingleProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [showUrlInput, setShowUrlInput] = useState(false);
	const [urlDraft, setUrlDraft] = useState("");
	const [urlError, setUrlError] = useState<string | null>(null);

	// Sync state với `value`:
	// - Nếu value là http URL → preset draft để admin thấy link cũ khi mở lại edit.
	// - Nếu value rỗng/null → reset toàn bộ UI link (modal tái dùng cho item mới).
	useEffect(() => {
		if (value && isHttpUrl(value)) {
			setUrlDraft(value);
			return;
		}
		if (!value) {
			setUrlDraft("");
			setUrlError(null);
			setShowUrlInput(false);
		}
	}, [value]);

	async function handleFileSelect(file: File) {
		if (file.size > maxSizeMB * 1024 * 1024) {
			toast.error(`File vượt quá ${maxSizeMB}MB`);
			return;
		}
		setUploading(true);
		try {
			const res: AdminFileUploadResponse = await uploadAdminFile(file);
			onChange(res.path);
			toast.success("Upload thành công");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Upload thất bại");
		} finally {
			setUploading(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	}

	function clear() {
		onChange(null);
		setUrlDraft("");
		setUrlError(null);
		setShowUrlInput(false);
		if (inputRef.current) inputRef.current.value = "";
	}

	function commitUrl() {
		const v = urlDraft.trim();
		if (!v) {
			setUrlError("Vui lòng nhập link");
			return;
		}
		if (!isHttpUrl(v)) {
			setUrlError("Link phải bắt đầu bằng http:// hoặc https://");
			return;
		}
		setUrlError(null);
		onChange(v);
		setShowUrlInput(false);
		toast.success("Đã dùng link ảnh");
	}

	const previewUrl = getImageUrl(value, "");

	return (
		<div className={className}>
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				className="hidden"
				disabled={disabled || uploading}
				onChange={(e) => {
					const f = e.target.files?.[0];
					if (f) void handleFileSelect(f);
				}}
			/>

			{previewUrl ? (
				<div className="inline-flex flex-col gap-2">
					<div className="relative inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-1">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={previewUrl}
							alt=""
							className="size-24 object-contain"
						/>
						<button
							type="button"
							onClick={clear}
							disabled={disabled || uploading}
							className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 disabled:opacity-60"
							aria-label="Xoá ảnh"
						>
							<X className="size-3.5" />
						</button>
					</div>
					{value && isHttpUrl(value) && (
						<div className="max-w-56 truncate text-[11px] text-gray-400">
							{value}
						</div>
					)}
				</div>
			) : (
				<div className="inline-flex flex-col items-start gap-2">
					{!showUrlInput ? (
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => inputRef.current?.click()}
								disabled={disabled || uploading}
								className="inline-flex flex-col items-center justify-center gap-1 size-24 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-colors hover:border-primary-400 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{uploading ? (
									<Loader2 className="size-5 animate-spin" />
								) : (
									<>
										<ImagePlus className="size-5" />
										<span className="text-xs">Tải lên</span>
									</>
								)}
							</button>
							{allowUrl && (
								<button
									type="button"
									onClick={() => {
										setShowUrlInput(true);
										setUrlError(null);
									}}
									disabled={disabled || uploading}
									className="inline-flex flex-col items-center justify-center gap-1 size-24 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-colors hover:border-primary-400 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
								>
									<Link2 className="size-5" />
									<span className="text-xs">Dùng link</span>
								</button>
							)}
						</div>
					) : (
						<div className="flex w-full max-w-md flex-col gap-1.5">
							<div className="flex gap-2">
								<input
									type="url"
									value={urlDraft}
									onChange={(e) => {
										setUrlDraft(e.target.value);
										if (urlError) setUrlError(null);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											commitUrl();
										}
									}}
									placeholder="https://example.com/image.jpg"
									disabled={disabled || uploading}
									autoFocus
									className="h-9 flex-1 rounded-md border border-gray-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
								/>
								<button
									type="button"
									onClick={commitUrl}
									disabled={disabled || uploading}
									className="inline-flex items-center gap-1 rounded-md bg-primary-600 px-3 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
								>
									<Upload className="size-3.5" />
									Dùng
								</button>
								<button
									type="button"
									onClick={() => {
										setShowUrlInput(false);
										setUrlError(null);
									}}
									disabled={disabled || uploading}
									className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60"
								>
									Hủy
								</button>
							</div>
							{urlError ? (
								<div className="text-xs text-red-500">{urlError}</div>
							) : (
								<div className="text-xs text-gray-400">
									Dán link http(s) ảnh và bấm Dùng (hoặc Enter)
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
