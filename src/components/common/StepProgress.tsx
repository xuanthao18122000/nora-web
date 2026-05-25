import { Check } from "lucide-react";
import type React from "react";

export interface StepProgressProps {
	/**
	 * Total number of steps
	 */
	steps: number;
	/**
	 * Current active step (1-based index)
	 */
	currentStep: number;
	/**
	 * Layout direction (default: "horizontal")
	 */
	direction?: "horizontal" | "vertical";
	/**
	 * Optional custom class name
	 */
	className?: string;
}

/**
 * A reusable step progress component that renders numbered steps connected by an animated line.
 */
export const StepProgress: React.FC<StepProgressProps> = ({
	steps,
	currentStep,
	direction = "horizontal",
	className = "",
}) => {
	const isHorizontal = direction === "horizontal";
	const stepsArray = Array.from({ length: steps }, (_, i) => i + 1);

	return (
		<>
			<style>
				{`
          @keyframes checkPop {
            0% { transform: scale(0); }
            60% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          .animate-check-pop {
            animation: checkPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
        `}
			</style>
			<div
				className={`flex w-full ${
					isHorizontal ? "flex-row items-center" : "flex-col"
				} ${className}`}
			>
				{stepsArray.map((step, index) => {
					const isCompleted = step < currentStep;
					const isActive = step === currentStep;
					const _isPending = step > currentStep;
					const isLast = index === steps - 1;

					return (
						<div
							key={step}
							className={`flex ${
								isHorizontal
									? isLast
										? "flex-row items-center"
										: "flex-row items-center flex-1"
									: isLast
										? "flex-col items-center"
										: "flex-col items-center"
							}`}
						>
							{/* Step Node */}
							<div
								className={`relative flex items-center justify-center w-8 h-8 rounded-full border-[2px] transition-all duration-500 ease-in-out z-10 bg-white ${
									isCompleted
										? "bg-green-600 border-green-600 scale-100"
										: isActive
											? "border-green-600 scale-110 shadow-sm"
											: "border-gray-300 scale-100"
								}`}
							>
								{isCompleted ? (
									<Check
										className="w-4 h-4 text-white animate-check-pop"
										strokeWidth={3}
									/>
								) : (
									<span
										className={`text-sm font-semibold transition-colors duration-300 ${
											isActive
												? "text-green-600"
												: "text-gray-400"
										}`}
									>
										{step}
									</span>
								)}
							</div>

							{/* Connecting Line */}
							{!isLast && (
								<div
									className={`bg-gray-200 overflow-hidden rounded-full ${
										isHorizontal
											? "h-1 flex-1 mx-3"
											: "w-1 h-12 my-2"
									}`}
								>
									<div
										className={`bg-green-600 transition-all duration-700 ease-in-out ${
											isHorizontal ? "h-full" : "w-full"
										}`}
										style={{
											width: isHorizontal
												? isCompleted
													? "100%"
													: "0%"
												: undefined,
											height: !isHorizontal
												? isCompleted
													? "100%"
													: "0%"
												: undefined,
										}}
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</>
	);
};
