# `app/` — Routing & Pages

Next.js **App Router** — mỗi folder = 1 route.

## Cấu trúc

```
app/
├── layout.tsx          → Root layout (SEO metadata, lang="vi")
├── page.tsx            → Homepage (re-export từ (shop)/page.tsx)
├── globals.css         → Design tokens (CSS variables)
├── not-found.tsx       → Trang 404
├── (shop)/             → Route group cho Storefront
│   ├── layout.tsx      → Shop layout (Header + Footer)
│   ├── page.tsx        → Homepage
│   └── [...slug]/      → ⚡ Slug Resolver (catch-all)
└── preview/            → Dev preview page (component showcase)
```

## Quy tắc

1. **Route group `(shop)/`** — không tạo URL segment, chỉ dùng để chia layout
2. **Fixed routes** (gio-hang, thanh-toan...) — tạo folder riêng trong `(shop)/`
3. **Dynamic routes** (category, product, CMS page) — đều đi qua `[...slug]/page.tsx`
4. **`page.tsx`** = Server Component mặc định. Thêm `"use client"` chỉ khi cần
5. **`layout.tsx`** = Wrap children, KHÔNG fetch data
6. **SEO** — mỗi page nên export `metadata` hoặc `generateMetadata()`
