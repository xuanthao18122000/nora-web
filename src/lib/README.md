# `lib/` — Shared Logic

Chứa logic dùng chung, KHÔNG chứa UI components.

## Cấu trúc

```
lib/
├── api/          → HTTP client & endpoint constants
├── hooks/        → Custom React hooks
├── utils/        → Pure functions (format, className merge)
└── constants/    → App constants (routes, config)
```

## Chi tiết

### `api/`

- **`client.ts`** — Fetch wrapper với error handling. Dùng `api.get()`, `api.post()`...
- **`endpoints.ts`** — Tất cả API path constants, mapped từ Backend FE Controllers
- Import: `import { api, API } from "@/lib/api"`

### `hooks/`

- Custom hooks cho data fetching, UI logic
- Tên bắt đầu bằng `use` (ví dụ: `useSearch`, `useCategories`)

### `utils/`

- **`format.ts`** — `formatPrice()`, `formatDate()`, `formatDiscount()`, `formatRating()`
- **`cn.ts`** — `cn()` merge classNames, lọc falsy values
- Pure functions, KHÔNG có side effects

### `constants/`

- **`routes.ts`** — Route path constants (`ROUTES.HOME`, `ROUTES.CART`...)
- Dùng constants thay vì hardcode string

## Quy tắc

1. Mỗi sub-folder phải có `index.ts` barrel export
2. KHÔNG import trực tiếp từ file, dùng barrel: `import { formatPrice } from "@/lib/utils"`
3. KHÔNG đặt React components vào `lib/` — dùng `components/` cho UI
