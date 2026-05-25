"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	Button,
	Dropdown,
	DropdownGroupLabel,
	DropdownItem,
} from "@/features/admin/ui";
import {
	LAYOUT_SECTION_OPTIONS,
	REPEATABLE_SECTION_KEYS,
	STOREFRONT_SECTION_OPTIONS,
	SYSTEM_SECTION_OPTIONS,
} from "./constants";

interface AddSectionDropdownProps {
	pageId: string;
	disabled?: boolean;
	/** Set các key đã có trong page — disable trong dropdown để tránh trùng. */
	existingKeys?: Set<string>;
}

export function AddSectionDropdown({ pageId, disabled, existingKeys }: AddSectionDropdownProps) {
	const router = useRouter();

	function navigate(query: string) {
		router.push(`/admin/pages/${pageId}/sections/new?${query}`);
	}

	return (
		<Dropdown
			trigger={
				<Button type="button" size="sm" disabled={disabled || !pageId}>
					<Plus className="h-4 w-4" />
					Thêm section
				</Button>
			}
		>
			{(close) => (
				<>
					{SYSTEM_SECTION_OPTIONS.map((opt) => (
						<DropdownItem
							key={opt.value}
							onClick={() => {
								navigate(`type=${opt.value}`);
								close();
							}}
						>
							{opt.label}
						</DropdownItem>
					))}

					{LAYOUT_SECTION_OPTIONS.length > 0 && (
						<>
							<DropdownGroupLabel>Layout</DropdownGroupLabel>
							{LAYOUT_SECTION_OPTIONS.map((opt) => {
								const taken = existingKeys?.has(opt.value);
								return (
									<DropdownItem
										key={opt.value}
										disabled={taken}
										onClick={() => {
											if (taken) return;
											navigate(`key=${opt.value}`);
											close();
										}}
									>
										{opt.label}
										{taken && <span className="ml-2 text-xs text-gray-400">(đã có)</span>}
									</DropdownItem>
								);
							})}
						</>
					)}

					{STOREFRONT_SECTION_OPTIONS.length > 0 && (
						<>
							<DropdownGroupLabel>Storefront</DropdownGroupLabel>
							{STOREFRONT_SECTION_OPTIONS.map((opt) => {
								const repeatable = REPEATABLE_SECTION_KEYS.has(opt.value);
								const taken = !repeatable && existingKeys?.has(opt.value);
								return (
									<DropdownItem
										key={opt.value}
										disabled={taken}
										onClick={() => {
											if (taken) return;
											navigate(`key=${opt.value}`);
											close();
										}}
									>
										{opt.label}
										{taken && <span className="ml-2 text-xs text-gray-400">(đã có)</span>}
									</DropdownItem>
								);
							})}
						</>
					)}
				</>
			)}
		</Dropdown>
	);
}
