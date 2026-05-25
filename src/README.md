# `src/` — DDV Web Client Source Code

## Kiến trúc tổng quan

```
src/
├── app/            → Routing & Pages (Next.js App Router)
├── components/     → UI Components (common, layout, feature)
├── lib/            → Shared logic (API, hooks, utils, constants)
├── store/          → Global state (Zustand)
└── types/          → TypeScript interfaces
```

## Luồng xử lý chính

```
User truy cập URL
    ↓
app/(shop)/[...slug]/page.tsx   → Gọi Slug API để xác định loại trang
    ↓
API trả về type: "category" | "product" | "page"
    ↓
Render component tương ứng:
  - CategoryPage (PLP)
  - ProductPage  (PDP)
  - CmsPage      (Trang CMS)
```

## Quy tắc chung

1. **Import bằng barrel export** — dùng `@/components/common` thay vì import trực tiếp file
2. **Design tokens** — tất cả styling dùng CSS variables từ `globals.css`
3. **API calls** — dùng `@/lib/api` (client.ts), KHÔNG gọi fetch trực tiếp
4. **Types** — import từ `@/types`, KHÔNG define inline
5. **State** — dùng Zustand stores từ `@/store`
6. **Path alias** — dùng `@/` (maps to `src/`)
