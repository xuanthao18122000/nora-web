"use client";

import { create } from "zustand";

interface DeviceState {
	isMobile: boolean;
	setIsMobile: (isMobile: boolean) => void;
}

export const useDeviceStore = create<DeviceState>()((set) => ({
	isMobile: false,
	setIsMobile: (isMobile: boolean) => set({ isMobile }),
}));
