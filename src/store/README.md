# `store/` — Global State (Zustand)

Client-side state management dùng [Zustand](https://github.com/pmndrs/zustand).

## Stores hiện có

| Store          | File              | Persist         | Mục đích                               |
| -------------- | ----------------- | --------------- | -------------------------------------- |
| `useCartStore` | `useCartStore.ts` | ✅ localStorage | Giỏ hàng: add, remove, update quantity |
| `useAuthStore` | (removed) | ✅ localStorage | Auth moved to React Context (`AuthProvider`) |

## Cách dùng

```tsx
"use client";
import { useCartStore } from "@/store";

export default function CartButton() {
  const totalItems = useCartStore((s) => s.getTotalItems());
  const addItem = useCartStore((s) => s.addItem);
  // ...
}
```

## Quy tắc

1. **`"use client"` bắt buộc** — Zustand stores chỉ hoạt động ở Client Component
2. **Tên file** — `use[Domain]Store.ts` (ví dụ: `useCartStore.ts`)
3. **Selector pattern** — dùng selector để tránh re-render không cần thiết
   ```ts
   // ✅ Chỉ re-render khi totalItems thay đổi
   const total = useCartStore((s) => s.getTotalItems());
   // ❌ Re-render mỗi khi store thay đổi
   const store = useCartStore();
   ```
4. **Persist** — dùng `persist` middleware cho data cần giữ khi reload
5. **Key naming** — localStorage key prefix `ddv-` (ví dụ: `ddv-cart`, `ddv-auth`)
