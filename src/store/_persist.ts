import type { StateCreator } from "zustand";
import { type PersistOptions, persist } from "zustand/middleware";

// zustand v5 + pnpm + moduleResolution:bundler resolves
// StoreMutatorIdentifier as `never` (zustand issue #2764).
// Cast persist back to a plain StateCreator so create() accepts it.
export const persistMiddleware = persist as unknown as <T>(
	config: StateCreator<T>,
	options: PersistOptions<T, Partial<T>>,
) => StateCreator<T>;
