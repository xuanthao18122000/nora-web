"use client";

import { Pencil } from "lucide-react";
import { Input } from "@/components/common/Input";

import CodeSnippet from "../CodeSnippet";

const inputId = "ds-input-demo";
const inputEmailId = "ds-input-email";
const inputPhoneId = "ds-input-phone";
const inputErrorId = "ds-input-error";
const inputSuccessId = "ds-input-success";

export default function DesignSystemInputPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="mb-2 text-2xl font-bold text-gray-900">Input</h1>
			<p className="mb-8 text-gray-600">
				Compound component: Root, Label, Required, LabelOptional, Slot,
				LeadingIcon, Field, Message. States: default, focus, filled,
				disabled, error, success. Luôn dùng <code>htmlFor</code> +{" "}
				<code>id</code> để gắn label với field (a11y).
			</p>

			<section className="mb-8">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
					Default
				</h2>
				<div className="max-w-xs">
					<Input.Root>
						<Input.Label htmlFor={inputId}>Label</Input.Label>
						<Input.Slot>
							<Input.Field
								id={inputId}
								placeholder="Input text"
							/>
						</Input.Slot>
					</Input.Root>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
					Label + Optional / Required (TextField)
				</h2>
				<div className="flex max-w-md flex-col gap-6">
					<Input.TextField
						label="Email"
						optional
						id={inputEmailId}
						type="email"
						placeholder="vietnnmoi@gmail.com"
					/>
					<Input.TextField
						label="Số điện thoại"
						required
						leadingIcon={<Pencil className="size-4" aria-hidden />}
						id={inputPhoneId}
						placeholder="090(xxx)"
					/>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
					Caption
				</h2>
				<div className="max-w-xs">
					<Input.Root>
						<Input.Label htmlFor="ds-input-caption">
							Label
						</Input.Label>
						<Input.Slot>
							<Input.Field
								id="ds-input-caption"
								placeholder="Input text"
							/>
						</Input.Slot>
						<Input.Message variant="caption">
							This is caption.
						</Input.Message>
					</Input.Root>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
					Error
				</h2>
				<div className="max-w-xs">
					<Input.Root>
						<Input.Label htmlFor={inputErrorId}>Label</Input.Label>
						<Input.Slot>
							<Input.Field
								id={inputErrorId}
								placeholder="Input text"
								aria-invalid
							/>
						</Input.Slot>
						<Input.Message variant="error">
							This is message feedback.
						</Input.Message>
					</Input.Root>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
					Success
				</h2>
				<div className="max-w-xs">
					<Input.Root>
						<Input.Label htmlFor={inputSuccessId}>
							Label
						</Input.Label>
						<Input.Slot>
							<Input.Field
								id={inputSuccessId}
								placeholder="Input text"
								data-success
							/>
						</Input.Slot>
						<Input.Message variant="success">
							This is message success.
						</Input.Message>
					</Input.Root>
				</div>
			</section>

			<section className="mb-8">
				<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
					Disabled & size sm
				</h2>
				<div className="flex max-w-md flex-col gap-6">
					<Input.Root>
						<Input.Label htmlFor="ds-input-disabled">
							Label
						</Input.Label>
						<Input.Slot>
							<Input.Field
								id="ds-input-disabled"
								placeholder="Input text"
								disabled
							/>
						</Input.Slot>
					</Input.Root>
					<Input.Root>
						<Input.Label htmlFor="ds-input-sm">Small</Input.Label>
						<Input.Slot size="sm">
							<Input.Field
								id="ds-input-sm"
								size="sm"
								placeholder="Small input"
							/>
						</Input.Slot>
					</Input.Root>
				</div>
			</section>

			<CodeSnippet
				title="Cách sử dụng"
				code={`import { Input } from "@/components/common/Input";

// Gọn: TextField (label + optional/required + icon + field)
<Input.TextField label="Email" optional id="email" type="email" placeholder="..." />
<Input.TextField label="Số điện thoại" required leadingIcon={<Pencil className="size-4" />} id="phone" placeholder="090(xxx)" />

// Compound (tùy biến sâu)
<Input.Root>
  <Input.Label htmlFor="email">Label</Input.Label>
  <Input.Slot>
    <Input.Field id="email" placeholder="Input text" />
  </Input.Slot>
</Input.Root>

// Label optional / required
<Input.Label htmlFor="email">Email <Input.LabelOptional /></Input.Label>
<Input.Label htmlFor="phone">Số điện thoại <Input.Required /></Input.Label>

// Icon trái
<Input.Slot>
  <Input.LeadingIcon><Pencil className="size-4" /></Input.LeadingIcon>
  <Input.Field id="phone" placeholder="090(xxx)" />
</Input.Slot>

// Caption / Error / Success
<Input.Message variant="caption">This is caption.</Input.Message>
<Input.Message variant="error">This is message feedback.</Input.Message>
<Input.Message variant="success">This is message success.</Input.Message>

// Error state: Field cần aria-invalid
<Input.Field id="err" aria-invalid />
// Success state: Field cần data-success
<Input.Field id="ok" data-success />

// Size sm
<Input.Slot size="sm">
  <Input.Field size="sm" placeholder="Small" />
</Input.Slot>`}
			/>
		</div>
	);
}
