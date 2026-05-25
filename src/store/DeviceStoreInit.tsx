"use client";

import { useRef } from "react";
import { useDeviceStore } from "./useDeviceStore";

/**
 * Hydrate useDeviceStore with server-detected isMobile value.
 * Renders nothing — just syncs store on mount.
 */
export function DeviceStoreInit({ isMobile }: { isMobile: boolean }) {
	const initialized = useRef(false);
	if (!initialized.current) {
		useDeviceStore.setState({ isMobile });
		initialized.current = true;
	}
	return null;
}
