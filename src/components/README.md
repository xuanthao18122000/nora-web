# `components/` — UI Components

## Cấu trúc

```
components/
├── common/           → Components dùng chung (Button, Badge, Card...)
├── layout/           → Layout (Header, Footer)
└── feature/          → Components theo tính năng
    ├── home/         →   Homepage (SectionCard, HeroBanner...)
    ├── product/      →   PDP (ProductGallery, SpecTable...)
    ├── cart/          →   Cart (CartItem, CartSummary...)
    └── checkout/     →   Checkout (CheckoutForm, PaymentMethod...)
```

## Phân loại

| Folder     | Khi nào dùng                    | Ví dụ                                   |
| ---------- | ------------------------------- | --------------------------------------- |
| `common/`  | Component xuất hiện ≥2 nơi      | Button, Badge, SearchInput, ProductCard |
| `layout/`  | Cấu trúc trang                  | Header, Footer, Sidebar                 |
| `feature/` | Chỉ dùng trong 1 feature cụ thể | FlashSaleSection, CheckoutForm          |

## Quy tắc

1. **Barrel export** — mỗi folder phải có `index.ts` export tất cả components

   ```ts
   // ✅ Đúng
   import { Button, Badge } from "@/components/common";
   // ❌ Sai
   import Button from "@/components/common/Button";
   ```

2. **1 component = 1 file** — tên file = tên component (PascalCase)

3. **Props interface** — đặt trong cùng file, tên = `ComponentNameProps`

4. **Styling** — dùng Tailwind CSS + design tokens từ `globals.css`. KHÔNG viết CSS riêng

5. **"use client"** — chỉ thêm khi component cần interactivity (onClick, useState...)
