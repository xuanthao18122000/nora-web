"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminLogin, AdminApiError } from "@/lib/api/admin";
import { useAdminAuthStore } from "@/store/admin";

export function LoginForm() {
	const router = useRouter();
	const setAuth = useAdminAuthStore((s) => s.setAuth);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		if (!email.trim() || !password) {
			setError("Vui lòng nhập đủ email và mật khẩu");
			return;
		}

		setSubmitting(true);
		try {
			const res = await adminLogin({ email: email.trim(), password });
			setAuth(res.accessToken, res.user);
			router.replace("/admin");
		} catch (err) {
			const message =
				err instanceof AdminApiError
					? err.message
					: "Đăng nhập thất bại. Vui lòng thử lại.";
			setError(message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="email"
					className="text-sm font-medium text-gray-700"
				>
					Email
				</label>
				<input
					id="email"
					type="email"
					autoComplete="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={submitting}
					placeholder="admin@acquyhn.vn"
					className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="password"
					className="text-sm font-medium text-gray-700"
				>
					Mật khẩu
				</label>
				<div className="relative">
					<input
						id="password"
						type={showPassword ? "text" : "password"}
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={submitting}
						placeholder="••••••••"
						className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-20 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
						tabIndex={-1}
					>
						{showPassword ? "Ẩn" : "Hiện"}
					</button>
				</div>
			</div>

			{error && (
				<div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					{error}
				</div>
			)}

			<button
				type="submit"
				disabled={submitting}
				className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{submitting ? "Đang đăng nhập..." : "Đăng nhập"}
			</button>
		</form>
	);
}
