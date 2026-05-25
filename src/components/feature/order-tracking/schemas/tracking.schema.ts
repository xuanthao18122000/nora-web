import { z } from "zod";

export const trackingSchema = z.object({
	phone: z
		.string()
		.trim()
		.min(1, "Vui lòng nhập số điện thoại")
		.regex(/^(0|\+84)\d{9}$/, "Số điện thoại không hợp lệ"),
});

export type TrackingFormValues = z.infer<typeof trackingSchema>;
