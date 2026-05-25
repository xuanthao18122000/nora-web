"use client";

import { ChevronDown, Filter, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Input, Select } from "@/features/admin/ui";
import type { FilterField, FilterValue } from "./types";

interface FilterPanelProps {
	fields: FilterField[];
	onFilter: (values: FilterValue) => void;
	onReset: () => void;
	title?: string;
	defaultExpanded?: boolean;
	isFetching?: boolean;
	className?: string;
}

interface DateRangeState {
	from: string;
	to: string;
}

type FieldValue = string | DateRangeState;

function emptyValueFor(field: FilterField): FieldValue {
	if (field.type === "dateRange") return { from: "", to: "" };
	return "";
}

function buildInitialState(fields: FilterField[]) {
	const out: Record<string, FieldValue> = {};
	for (const f of fields) out[f.id] = emptyValueFor(f);
	return out;
}

/**
 * Bộ lọc dùng chung — hiển thị card có thể expand/collapse.
 *
 * Output `onFilter`:
 *  - text/select: `{ <id>: string|number }`
 *  - dateRange: `{ <id>From: ISO, <id>To: ISO }` (hoặc dùng `rangeKey` để đổi tên)
 */
export function FilterPanel({
	fields,
	onFilter,
	onReset,
	title = "Bộ lọc",
	defaultExpanded = true,
	isFetching = false,
	className = "",
}: FilterPanelProps) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const [values, setValues] = useState<Record<string, FieldValue>>(() =>
		buildInitialState(fields),
	);

	// Reset state khi fields config đổi
	useEffect(() => {
		setValues(buildInitialState(fields));
	}, [fields]);

	function update(id: string, value: FieldValue) {
		setValues((s) => ({ ...s, [id]: value }));
	}

	const hasAnyValue = useMemo(() => {
		return Object.values(values).some((v) => {
			if (typeof v === "string") return v.trim() !== "";
			return Boolean(v.from || v.to);
		});
	}, [values]);

	function handleApply(e?: React.FormEvent) {
		e?.preventDefault();
		const out: FilterValue = {};

		for (const field of fields) {
			const raw = values[field.id];

			if (field.type === "dateRange") {
				const range = raw as DateRangeState;
				if (!range.from && !range.to) continue;
				const keys = field.rangeKey ?? {
					from: `${field.id}From`,
					to: `${field.id}To`,
				};
				if (range.from) out[keys.from] = new Date(range.from).toISOString();
				if (range.to) {
					// Set thời điểm cuối ngày để lọc inclusive
					const endOfDay = new Date(range.to);
					endOfDay.setHours(23, 59, 59, 999);
					out[keys.to] = endOfDay.toISOString();
				}
				continue;
			}

			const value = (raw as string).trim();
			if (!value) continue;
			out[field.id] = value;
		}

		onFilter(out);
	}

	function handleReset() {
		setValues(buildInitialState(fields));
		onReset();
	}

	return (
		<Card className={className}>
			<form onSubmit={handleApply}>
				<div className="flex items-center justify-between gap-2 px-5 py-3">
					<button
						type="button"
						onClick={() => setIsExpanded((v) => !v)}
						className="flex flex-1 items-center gap-2 text-left text-sm font-semibold text-gray-700 hover:opacity-80"
					>
						<Filter className="h-4 w-4" />
						<span className="truncate">{title}</span>
						<ChevronDown
							className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
						/>
					</button>
					{isExpanded && (
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="secondary"
								size="sm"
								onClick={handleReset}
								disabled={!hasAnyValue || isFetching}
							>
								<RotateCcw className="h-3.5 w-3.5" />
								Đặt lại
							</Button>
							<Button type="submit" size="sm" disabled={isFetching}>
								<Search className="h-3.5 w-3.5" />
								Áp dụng
							</Button>
						</div>
					)}
				</div>

				<div
					className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr] opacity-0"}`}
				>
					<div className="overflow-hidden">
						<div className="grid grid-cols-1 gap-3 border-t border-gray-100 px-5 py-4 md:grid-cols-2 lg:grid-cols-4">
							{fields.map((field) => (
								<FieldControl
									key={field.id}
									field={field}
									value={values[field.id] ?? emptyValueFor(field)}
									onChange={(v) => update(field.id, v)}
								/>
							))}
						</div>
					</div>
				</div>
			</form>
		</Card>
	);
}

function FieldControl({
	field,
	value,
	onChange,
}: {
	field: FilterField;
	value: FieldValue;
	onChange: (v: FieldValue) => void;
}) {
	if (field.type === "text") {
		const v = value as string;
		return (
			<div className="flex flex-col gap-1.5">
				<label htmlFor={field.id} className="text-xs font-medium text-gray-600">
					{field.label}
				</label>
				<div className="relative">
					<Input
						id={field.id}
						value={v}
						onChange={(e) => onChange(e.target.value)}
						placeholder={field.placeholder ?? `Nhập ${field.label.toLowerCase()}`}
						className={v ? "pr-9" : ""}
					/>
					{v && (
						<button
							type="button"
							onClick={() => onChange("")}
							className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
							aria-label="Xoá"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
			</div>
		);
	}

	if (field.type === "select") {
		const v = value as string;
		return (
			<div className="flex flex-col gap-1.5">
				<label htmlFor={field.id} className="text-xs font-medium text-gray-600">
					{field.label}
				</label>
				<Select id={field.id} value={v} onChange={(e) => onChange(e.target.value)}>
					<option value="">{field.placeholder ?? "Tất cả"}</option>
					{field.options?.map((opt) => (
						<option key={String(opt.value)} value={String(opt.value)}>
							{opt.label}
						</option>
					))}
				</Select>
			</div>
		);
	}

	if (field.type === "dateRange") {
		const range = value as DateRangeState;
		return (
			<div className="flex flex-col gap-1.5">
				<label className="text-xs font-medium text-gray-600">{field.label}</label>
				<div className="grid grid-cols-2 gap-2">
					<Input
						type="date"
						value={range.from}
						onChange={(e) => onChange({ ...range, from: e.target.value })}
						aria-label={`${field.label} - từ`}
					/>
					<Input
						type="date"
						value={range.to}
						onChange={(e) => onChange({ ...range, to: e.target.value })}
						aria-label={`${field.label} - đến`}
					/>
				</div>
			</div>
		);
	}

	return null;
}
