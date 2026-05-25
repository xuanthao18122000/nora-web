# `(shop)/` — Storefront Route Group

Tất cả trang storefront (Homepage, PLP, PDP, Cart, Checkout...) nằm trong route group này.

## Slug Resolver — Kiến trúc chính

```
URL: /dien-thoai
    ↓
[...slug]/page.tsx
    ↓
Gọi API: GET /slug/dien-thoai
    ↓
Response: { type: "category", data: {...} }
    ↓
Render: <CategoryPage data={...} />
```

Tất cả dynamic URL đều đi qua **1 entry point duy nhất**: `[...slug]/page.tsx`.
Backend Slug API quyết định đó là category, product, hay CMS page.

## Thêm route mới

**Fixed route** (ví dụ: giỏ hàng):

```
(shop)/
└── gio-hang/
    └── page.tsx    ← URL: /gio-hang
```

**Dynamic route** — KHÔNG tạo folder mới, thêm `case` vào `[...slug]/page.tsx`.

## Layout

`layout.tsx` wrap tất cả children bằng Header + Footer.
