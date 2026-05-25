"use client";

import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { API, ApiError, api } from "@/lib/api";

interface ContactFormModalProps {
	open: boolean;
	onClose: () => void;
	productId?: number;
	productName?: string;
}

interface FormState {
	name: string;
	phone: string;
	email: string;
	address: string;
	notes: string;
}

const INITIAL: FormState = {
	name: "",
	phone: "",
	email: "",
	address: "",
	notes: "",
};

export default function ContactFormModal({
	open,
	onClose,
	productId,
	productName,
}: ContactFormModalProps) {
	const [form, setForm] = useState<FormState>(INITIAL);
	const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
		{},
	);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (open) {
			setForm(INITIAL);
			setErrors({});
		}
	}, [open]);

	// Lock body scroll
	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [open]);

	if (!open) return null;

	function update<K extends keyof FormState>(key: K, value: string) {
		setForm((s) => ({ ...s, [key]: value }));
		if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
	}

	function validate(): boolean {
		const next: Partial<Record<keyof FormState, string>> = {};
		if (!form.name.trim()) next.name = "Vui lòng nhập họ tên";
		const phone = form.phone.trim();
		if (!phone) next.phone = "Vui lòng nhập số điện thoại";
		else if (!/^[0-9+\-\s]{8,15}$/.test(phone))
			next.phone = "Số điện thoại không hợp lệ";
		if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
			next.email = "Email không hợp lệ";
		setErrors(next);
		return Object.keys(next).length === 0;
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (submitting) return;
		if (!validate()) return;

		setSubmitting(true);
		try {
			await api.post(API.CONTACT.CREATE, {
				name: form.name.trim(),
				phone: form.phone.trim(),
				email: form.email.trim() || undefined,
				address: form.address.trim() || undefined,
				notes: form.notes.trim() || undefined,
				productId,
				productName,
			});
			toast.success("Đã gửi! Chúng tôi sẽ liên hệ bạn sớm nhất.");
			onClose();
		} catch (err) {
			const msg =
				err instanceof ApiError
					? err.message
					: "Có lỗi xảy ra, vui lòng thử lại.";
			toast.error(msg);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="contact-modal-title"
			onClick={onClose}
		>
			<div
				className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
					<div>
						<h3
							id="contact-modal-title"
							className="text-base font-semibold text-gray-900"
						>
							Để lại thông tin đặt hàng
						</h3>
						{productName && (
							<p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
								Sản phẩm: <span className="font-medium">{productName}</span>
							</p>
						)}
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Đóng"
						className="-mr-1 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					>
						<X className="size-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-1 flex-col">
					<div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
						<FormField
							label="Họ và tên"
							required
							error={errors.name}
							value={form.name}
							onChange={(v) => update("name", v)}
							placeholder="Nguyễn Văn A"
							disabled={submitting}
							autoFocus
						/>
						<FormField
							label="Số điện thoại"
							required
							type="tel"
							error={errors.phone}
							value={form.phone}
							onChange={(v) => update("phone", v)}
							placeholder="0901234567"
							disabled={submitting}
						/>
						<FormField
							label="Email"
							type="email"
							error={errors.email}
							value={form.email}
							onChange={(v) => update("email", v)}
							placeholder="email@example.com (tuỳ chọn)"
							disabled={submitting}
						/>
						<FormField
							label="Địa chỉ"
							error={errors.address}
							value={form.address}
							onChange={(v) => update("address", v)}
							placeholder="Số nhà, đường, phường/xã, quận/huyện (tuỳ chọn)"
							disabled={submitting}
						/>
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">
								Ghi chú
							</label>
							<textarea
								value={form.notes}
								onChange={(e) => update("notes", e.target.value)}
								disabled={submitting}
								rows={3}
								placeholder="Ghi chú thêm (tuỳ chọn)"
								className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-60"
							/>
						</div>
					</div>

					<div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">
						<button
							type="button"
							onClick={onClose}
							disabled={submitting}
							className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
						>
							Hủy
						</button>
						<button
							type="submit"
							disabled={submitting}
							className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
						>
							{submitting && <Loader2 className="size-4 animate-spin" />}
							Gửi yêu cầu
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

interface FormFieldProps {
	label: string;
	required?: boolean;
	type?: string;
	error?: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	disabled?: boolean;
	autoFocus?: boolean;
}

function FormField({
	label,
	required,
	type = "text",
	error,
	value,
	onChange,
	placeholder,
	disabled,
	autoFocus,
}: FormFieldProps) {
	return (
		<div>
			<label className="mb-1 block text-sm font-medium text-gray-700">
				{label}
				{required && <span className="ml-0.5 text-red-500">*</span>}
			</label>
			<input
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				disabled={disabled}
				autoFocus={autoFocus}
				className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-60 ${
					error
						? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
						: "border-gray-300 focus:border-primary-500 focus:ring-primary-500/20"
				}`}
			/>
			{error && <div className="mt-1 text-xs text-red-500">{error}</div>}
		</div>
	);
}
