"use client";

import type { ReactNode } from "react";
import { SWRConfig } from "swr";

export default function SWRProvider({ children }: { children: ReactNode }) {
	return (
		<SWRConfig
			value={{
				revalidateOnFocus: true,
				revalidateOnReconnect: true,
				dedupingInterval: 2000,
				keepPreviousData: true,
			}}
		>
			{children}
		</SWRConfig>
	);
}
