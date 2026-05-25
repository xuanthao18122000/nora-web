"use client";

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

const baseInputClass =
	"w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
	function Input({ className = "", ...rest }, ref) {
		return <input ref={ref} {...rest} className={`${baseInputClass} ${className}`} />;
	},
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
	function Textarea({ className = "", ...rest }, ref) {
		return (
			<textarea
				ref={ref}
				{...rest}
				className={`${baseInputClass} min-h-[88px] resize-y ${className}`}
			/>
		);
	},
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
	function Select({ className = "", children, ...rest }, ref) {
		return (
			<select ref={ref} {...rest} className={`${baseInputClass} ${className}`}>
				{children}
			</select>
		);
	},
);

interface FieldProps {
	label: string;
	required?: boolean;
	error?: string;
	hint?: string;
	htmlFor?: string;
	children: React.ReactNode;
}

export function Field({ label, required, error, hint, htmlFor, children }: FieldProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<label
				htmlFor={htmlFor}
				className="text-sm font-medium text-gray-700"
			>
				{label}
				{required && <span className="ml-0.5 text-red-500">*</span>}
			</label>
			{children}
			{error && <p className="text-xs text-red-600">{error}</p>}
			{!error && hint && <p className="text-xs text-gray-500">{hint}</p>}
		</div>
	);
}
