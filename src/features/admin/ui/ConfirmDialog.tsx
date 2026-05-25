"use client";

import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import { Button } from "./Button";

interface ConfirmOptions {
	title: string;
	description?: ReactNode;
	confirmText?: string;
	cancelText?: string;
	tone?: "danger" | "primary";
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmCtx = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
	const [opts, setOpts] = useState<ConfirmOptions | null>(null);
	const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

	const confirm = useCallback<ConfirmFn>(
		(options) =>
			new Promise<boolean>((resolve) => {
				setOpts(options);
				setResolver(() => resolve);
			}),
		[],
	);

	function settle(value: boolean) {
		resolver?.(value);
		setResolver(null);
		setOpts(null);
	}

	return (
		<ConfirmCtx.Provider value={confirm}>
			{children}
			{opts && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
					<div
						className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
						role="dialog"
						aria-modal="true"
					>
						<h3 className="text-base font-semibold text-gray-900">{opts.title}</h3>
						{opts.description && (
							<div className="mt-2 text-sm text-gray-600">{opts.description}</div>
						)}
						<div className="mt-5 flex justify-end gap-2">
							<Button variant="secondary" onClick={() => settle(false)}>
								{opts.cancelText || "Hủy"}
							</Button>
							<Button
								variant={opts.tone === "danger" ? "danger" : "primary"}
								onClick={() => settle(true)}
							>
								{opts.confirmText || "Xác nhận"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</ConfirmCtx.Provider>
	);
}

export function useConfirm() {
	const fn = useContext(ConfirmCtx);
	if (!fn) throw new Error("useConfirm must be used within ConfirmProvider");
	return fn;
}
