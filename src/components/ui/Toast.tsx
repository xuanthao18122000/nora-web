"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { createPortal } from "react-dom";

// ── Types ──
export type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
	id: number;
	type: ToastType;
	message: string;
}

// ── Context ──
interface ToastCtx {
	showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastCtx>({ showToast: () => {} });

// ── Provider ──
let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<ToastItem[]>([]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const showToast = useCallback(
		(message: string, type: ToastType = "info") => {
			const id = ++idCounter;
			setToasts((prev) => [...prev, { id, type, message }]);
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, 4000);
		},
		[],
	);

	const dismiss = (id: number) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	const iconMap: Record<ToastType, string> = {
		success: "✓",
		error: "✕",
		warning: "⚠",
		info: "ℹ",
	};

	const bgMap: Record<ToastType, string> = {
		success: "#16a34a",
		error: "#BE1E2D",
		warning: "#d97706",
		info: "#2563eb",
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{mounted &&
				toasts.length > 0 &&
				createPortal(
					<div
						style={{
							position: "fixed",
							top: 16,
							left: "50%",
							transform: "translateX(-50%)",
							zIndex: 9999,
							display: "flex",
							flexDirection: "column",
							gap: 8,
							width: "min(92vw, 480px)",
							pointerEvents: "none",
						}}
						aria-live="polite"
					>
						{toasts.map((t) => (
							<div
								key={t.id}
								style={{
									display: "flex",
									alignItems: "center",
									gap: 10,
									background: bgMap[t.type],
									color: "#fff",
									padding: "12px 16px",
									borderRadius: 12,
									fontSize: 14,
									fontWeight: 500,
									boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
									animation: "toast-in 0.3s ease",
									pointerEvents: "all",
									cursor: "pointer",
								}}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ")
										dismiss(t.id);
								}}
								onClick={() => dismiss(t.id)}
							>
								<span
									style={{
										fontSize: 16,
										flexShrink: 0,
										fontWeight: 700,
									}}
								>
									{iconMap[t.type]}
								</span>
								<span style={{ flex: 1 }}>{t.message}</span>
							</div>
						))}
					</div>,
					document.body,
				)}
			<style>{`
				@keyframes toast-in {
					from { opacity: 0; transform: translateY(12px) scale(0.97); }
					to   { opacity: 1; transform: translateY(0) scale(1); }
				}
			`}</style>
		</ToastContext.Provider>
	);
}

// ── Hook ──
export function useToast() {
	return useContext(ToastContext);
}
