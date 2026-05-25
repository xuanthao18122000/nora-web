import { Check } from "lucide-react";
import {
	Stepper,
	StepperIcon,
	StepperItem,
	StepperTrack,
} from "@/components/common/Stepper";
import { cn } from "@/lib/utils";

/**
 * FE status bucket (matches FE_ORDER_STATUS enum in backend).
 * 1=ALL, 2=PENDING_CONFIRM, 3=CONFIRMED, 4=DELIVERED, 5=CANCELLED.
 */
export const FE_STATUS = {
	ALL: 1,
	PENDING_CONFIRM: 2,
	CONFIRMED: 3,
	DELIVERED: 4,
	CANCELLED: 5,
} as const;

interface OrderStep {
	label: string;
	completed: boolean;
}

function getOrderSteps(status: number): OrderStep[] {
	if (status === FE_STATUS.CANCELLED) {
		return [
			{ label: "Đặt hàng thành công", completed: true },
			{ label: "Đơn hàng đã huỷ", completed: true },
		];
	}
	return [
		{ label: "Đặt hàng thành công", completed: true },
		{
			label: "Đã xác nhận",
			completed:
				status === FE_STATUS.CONFIRMED ||
				status === FE_STATUS.DELIVERED,
		},
		{
			label: "Đã nhận hàng",
			completed: status === FE_STATUS.DELIVERED,
		},
	];
}

interface OrderStepProgressProps {
	/** FE status bucket (1-5). */
	status: number;
	className?: string;
}

/**
 * Horizontal order progress stepper. Used on both `/account/orders/:id`
 * and `/order-tracking` views.
 */
export function OrderStepProgress({
	status,
	className,
}: OrderStepProgressProps) {
	const steps = getOrderSteps(status);
	const lastCompletedIndex = steps.reduce(
		(acc, step, idx) => (step.completed ? idx : acc),
		-1,
	);
	const activeStep = lastCompletedIndex < 0 ? 0 : lastCompletedIndex;

	return (
		<div className={cn("px-0 md:px-10 lg:px-30", className)}>
			<Stepper
				value={activeStep}
				stepCount={steps.length}
				className="grid gap-0"
				style={{
					gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
				}}
			>
				{steps.map((step, index) => {
					const isCompleted = step.completed;
					return (
						<StepperItem
							key={step.label}
							value={index}
							disabled
							className="min-w-0 flex-col items-center gap-2 cursor-default"
						>
							<StepperTrack
								lineCompleteClassName="bg-primary-500"
								lineIncompleteClassName="bg-gray-200"
							>
								<StepperIcon
									className={cn(
										"box-border size-5 border-0 transition-colors duration-150",
										isCompleted
											? "bg-primary-500 text-white"
											: "bg-gray-200 text-transparent",
									)}
								>
									{isCompleted ? (
										<Check
											className="size-3"
											aria-hidden="true"
											strokeWidth={3}
										/>
									) : null}
								</StepperIcon>
							</StepperTrack>
							<span
								className={cn(
									"w-full max-w-full px-0.5 text-center text-xs leading-snug line-clamp-2",
									isCompleted
										? "font-medium text-text-primary"
										: "font-normal text-gray-600",
								)}
							>
								{step.label}
							</span>
						</StepperItem>
					);
				})}
			</Stepper>
		</div>
	);
}
