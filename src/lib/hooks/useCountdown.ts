"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
	type CountdownResult,
	endTimeToMs,
	formatFlashSaleCountdown,
} from "@/lib/utils/format";

/* ── Shared 1-second tick (single setInterval for ALL countdown instances) ── */

type Listener = () => void;
const listeners = new Set<Listener>();
let intervalId: number | undefined;

function subscribeToTick(listener: Listener) {
	if (listeners.size === 0) {
		intervalId = window.setInterval(() => {
			for (const l of listeners) l();
		}, 1000);
	}
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
		if (listeners.size === 0 && intervalId !== undefined) {
			window.clearInterval(intervalId);
			intervalId = undefined;
		}
	};
}

/* ── useCountdown Hook ── */

export interface UseCountdownResult extends CountdownResult {
	endAtMs: number;
}

// Server + first client render: identical placeholder → no hydration mismatch.
// Real countdown text is filled in after mount via useEffect.
const PLACEHOLDER: CountdownResult = { prefix: "Còn", time: "00:00:00" };

export function useCountdown(
	endAt: string | null | undefined,
	endTime: string | null | undefined,
): UseCountdownResult {
	const endAtMs = useMemo(() => {
		// endTime (daily window like "12:00") takes priority
		if (endTime) return endTimeToMs(endTime);
		if (endAt) return new Date(endAt).getTime() || 0;
		return 0;
	}, [endAt, endTime]);

	const [countdown, setCountdown] = useState<CountdownResult>(PLACEHOLDER);
	const endAtMsRef = useRef(endAtMs);
	endAtMsRef.current = endAtMs;

	useEffect(() => {
		if (!endAtMsRef.current || !Number.isFinite(endAtMsRef.current)) return;

		const tick = () => {
			const nowMs = Date.now();
			setCountdown(formatFlashSaleCountdown(endAtMsRef.current, nowMs));
			if (nowMs >= endAtMsRef.current) {
				listeners.delete(tick);
			}
		};

		tick();
		return subscribeToTick(tick);
	}, []);

	return { ...countdown, endAtMs };
}
