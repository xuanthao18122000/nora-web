"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import CartHeader from "@/components/feature/cart/components/cart-header.client";
import {
	type TrackingFormValues,
	trackingSchema,
} from "../schemas/tracking.schema";

interface TrackingSearchFormProps {
	defaultPhone?: string;
	error?: string | null;
	isLoading?: boolean;
	onSubmit: (values: TrackingFormValues) => void;
	onBack: () => void;
}

export function TrackingSearchForm({
	defaultPhone = "",
	error,
	isLoading = false,
	onSubmit,
	onBack,
}: TrackingSearchFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<TrackingFormValues>({
		resolver: zodResolver(trackingSchema),
		defaultValues: {
			phone: defaultPhone,
		},
	});

	return (
		<>
			{/* -- Page Header -- */}
			<div className="animate-section-enter stagger-1">
				<CartHeader title="Tra cứu đơn hàng" onBack={onBack} />
			</div>

			{/* -- Search Card -- */}
			<div className="rounded-2xl bg-white shadow-sm overflow-hidden animate-section-enter stagger-2">
				<div className="px-5 pt-6 pb-7 flex flex-col items-center">
					{/* Icon hero */}
					<div className="mb-5 flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 shadow-sm">
						<Search
							className="w-7 h-7 text-primary-500"
							strokeWidth={2}
						/>
					</div>

					<h2 className="text-lg font-bold text-gray-900 mb-1 text-center">
						Tra cứu đơn hàng
					</h2>
					<p className="text-gray-400 text-sm text-center mb-6 max-w-xs">
						Nhập số điện thoại đặt hàng để xem các đơn của bạn.
					</p>

					{error && (
						<div className="w-full max-w-sm p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-xl text-center">
							{error}
						</div>
					)}

					<form
						onSubmit={handleSubmit(onSubmit)}
						noValidate
						className="w-full flex gap-3 flex-col max-w-sm"
					>
						{/* Phone field */}
						<Input.Root className="mb-3">
							<Input.Label htmlFor="tracking-phone">
								Số điện thoại
								<Input.Required />
							</Input.Label>
							<Input.Slot>
								<Input.LeadingIcon>
									<Phone className="w-4 h-4" />
								</Input.LeadingIcon>
								<Input.Field
									id="tracking-phone"
									placeholder="SĐT khi đặt hàng"
									inputMode="tel"
									maxLength={10}
									autoComplete="tel"
									aria-invalid={!!errors.phone}
									{...register("phone")}
								/>
							</Input.Slot>
							{errors.phone && (
								<Input.Message variant="error">
									{errors.phone.message}
								</Input.Message>
							)}
						</Input.Root>

						<Button
							type="submit"
							variant="filled"
							color="primary"
							size="sm"
							loading={isSubmitting || isLoading}
							className="mt-1 mb-7 w-full rounded-xl"
							leadingIcon={<Search className="w-4 h-4" />}
						>
							Tra cứu ngay
						</Button>
					</form>
				</div>
			</div>
		</>
	);
}
