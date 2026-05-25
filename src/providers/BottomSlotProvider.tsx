"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface BottomSlotContextValue {
	node: ReactNode | null;
	setSlot: (node: ReactNode | null) => void;
}

const BottomSlotContext = createContext<BottomSlotContextValue>({
	node: null,
	setSlot: () => {},
});

/**
 * Provides a slot for page-specific bottom floating content (e.g. product
 * detail desktop CTA bar) that should be rendered inside BottomFloatingStack.
 */
export function BottomSlotProvider({ children }: { children: ReactNode }) {
	const [node, setNode] = useState<ReactNode | null>(null);

	const setSlot = useCallback((n: ReactNode | null) => {
		setNode(n);
	}, []);

	return (
		<BottomSlotContext.Provider value={{ node, setSlot }}>
			{children}
		</BottomSlotContext.Provider>
	);
}

/** Read the current slot content (used by BottomFloatingStack). */
export function useBottomSlot(): ReactNode | null {
	return useContext(BottomSlotContext).node;
}

/**
 * Push content into the bottom slot. Content is removed on unmount.
 *
 * @example
 * useBottomSlotRegister(isCtaVisible ? null : <DesktopCTABar />);
 */
export function useBottomSlotRegister(node: ReactNode | null) {
	const { setSlot } = useContext(BottomSlotContext);

	useEffect(() => {
		setSlot(node);
		return () => setSlot(null);
	}, [node, setSlot]);
}
