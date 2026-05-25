import { z } from "zod";

export const checkoutFormSchema = z.object({
	customerName: z
		.string()
		.trim()
		.min(1, "Vui lòng nhập họ và tên")
		.max(120, "Họ và tên tối đa 120 ký tự"),
	phone: z
		.string()
		.trim()
		.min(1, "Vui lòng nhập số điện thoại")
		.regex(/^(0|\+84)\d{9}$/, "Số điện thoại không hợp lệ"),
	email: z
		.string()
		.trim()
		.min(1, "Vui lòng nhập email")
		.max(254, "Email quá dài")
		.refine((s) => z.email().safeParse(s).success, "Email không hợp lệ"),
	shippingAddress: z
		.string()
		.trim()
		.min(1, "Vui lòng nhập địa chỉ giao hàng")
		.max(500, "Địa chỉ tối đa 500 ký tự"),
	note: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
