"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// ─── Context ─────────────────────────────────────────────────────────────

type StepperContextValue = {
	activeStep: number;
	setActiveStep: (step: number) => void;
	stepCount: number;
};

const StepperContext = React.createContext<StepperContextValue | null>(null);

const StepperItemContext = React.createContext<{ index: number } | null>(null);

/** Root stepper state. Must be used under `<Stepper>`. */
export function useStepper(): StepperContextValue {
	const ctx = React.useContext(StepperContext);
	if (!ctx) {
		throw new Error("useStepper must be used within <Stepper>");
	}
	return ctx;
}

/** 0-based index of the surrounding `<StepperItem>`. */
export function useStepperItemIndex(): number {
	const ctx = React.useContext(StepperItemContext);
	if (!ctx) {
		throw new Error(
			"useStepperItemIndex must be used within <StepperItem>",
		);
	}
	return ctx.index;
}

// ─── Controlled / uncontrolled step index ─────────────────────────────────

function useControllableStepIndex(
	valueProp: number | undefined,
	defaultValue: number,
	onChange?: (value: number) => void,
): [number, (next: number) => void] {
	const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
	const isControlled = valueProp !== undefined;
	const activeStep = isControlled ? valueProp : uncontrolled;

	const setActiveStep = React.useCallback(
		(next: number) => {
			if (!isControlled) {
				setUncontrolled(next);
			}
			onChange?.(next);
		},
		[isControlled, onChange],
	);

	return [activeStep, setActiveStep];
}

// ─── Stepper ─────────────────────────────────────────────────────────────

export interface StepperProps
	extends Omit<
		React.HTMLAttributes<HTMLDivElement>,
		"onChange" | "defaultValue"
	> {
	/** Controlled current step (0-based). Omit with `defaultValue` for uncontrolled. */
	value?: number;
	/** Initial step when uncontrolled. Ignored when `value` is set. */
	defaultValue?: number;
	onChange?: (value: number) => void;
	/** Total steps; required for `StepperTrack` connector ends. */
	stepCount: number;
}

function Stepper({
	className,
	value: valueProp,
	defaultValue = 0,
	onChange,
	stepCount,
	children,
	...props
}: StepperProps) {
	const [activeStep, setActiveStep] = useControllableStepIndex(
		valueProp,
		defaultValue,
		onChange,
	);

	const contextValue = React.useMemo<StepperContextValue>(
		() => ({
			activeStep,
			setActiveStep,
			stepCount,
		}),
		[activeStep, setActiveStep, stepCount],
	);

	return (
		<StepperContext.Provider value={contextValue}>
			<div className={cn("w-full min-w-0", className)} {...props}>
				{children}
			</div>
		</StepperContext.Provider>
	);
}

// ─── StepperItem ─────────────────────────────────────────────────────────

export interface StepperItemProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: number;
	disabled?: boolean;
}

function StepperItem({
	className,
	value,
	disabled,
	children,
	...props
}: StepperItemProps) {
	const { activeStep, setActiveStep } = useStepper();
	const isActive = activeStep === value;
	const isCompleted = activeStep > value;
	const isDisabled = disabled || activeStep < value;

	const itemCtx = React.useMemo(() => ({ index: value }), [value]);

	return (
		<StepperItemContext.Provider value={itemCtx}>
			<button
				type="button"
				className={cn(
					"flex w-full min-w-0 items-center",
					!isDisabled && "cursor-pointer",
					className,
				)}
				data-active={isActive}
				data-completed={isCompleted}
				data-disabled={isDisabled}
				{...props}
				disabled={isDisabled}
				onClick={() => setActiveStep(value)}
			>
				{children}
			</button>
		</StepperItemContext.Provider>
	);
}

// ─── StepperTrack [ line | node | line ] ────────────────────────────────

export interface StepperTrackProps
	extends React.HTMLAttributes<HTMLDivElement> {
	lineCompleteClassName?: string;
	lineIncompleteClassName?: string;
}

/**
 * Row: left connector · center slot (`children`, e.g. `StepperIcon`) · right connector.
 * Centers the node in the cell so labels can sit directly underneath.
 */
function StepperTrack({
	className,
	children,
	lineCompleteClassName = "bg-blue-500",
	lineIncompleteClassName = "bg-gray-200",
	...props
}: StepperTrackProps) {
	const { activeStep, stepCount } = useStepper();
	const index = useStepperItemIndex();

	const isFirst = index === 0;
	const isLast = index >= stepCount - 1;
	const lineLeftDone = index > 0 && activeStep >= index;
	const lineRightDone = !isLast && activeStep > index;

	return (
		<div
			className={cn("flex w-full min-w-0 items-center", className)}
			{...props}
		>
			<div
				className={cn(
					"min-h-1 min-w-0 flex-1 self-center rounded-full transition-colors duration-150",
					isFirst && "opacity-0",
					!isFirst &&
						(lineLeftDone
							? lineCompleteClassName
							: lineIncompleteClassName),
				)}
				aria-hidden="true"
			/>
			{children}
			<div
				className={cn(
					"min-h-1 min-w-0 flex-1 self-center rounded-full transition-colors duration-150",
					isLast && "opacity-0",
					!isLast &&
						(lineRightDone
							? lineCompleteClassName
							: lineIncompleteClassName),
				)}
				aria-hidden="true"
			/>
		</div>
	);
}

// ─── StepperIcon ─────────────────────────────────────────────────────────

export type StepperIconProps = React.HTMLAttributes<HTMLDivElement>;

function StepperIcon({ className, children, ...props }: StepperIconProps) {
	return (
		<div
			className={cn(
				"relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export { Stepper, StepperIcon, StepperItem, StepperTrack };
