# `types/` — TypeScript Interfaces

Tất cả type definitions dùng chung cho toàn project.

## Files

| File         | Interfaces                                        | Mapped từ Backend                                          |
| ------------ | ------------------------------------------------- | ---------------------------------------------------------- |
| `product.ts` | Product, ProductVariant, Category, Brand          | `modules/products/entities/`, `modules/category/entities/` |
| `page.ts`    | Page, PageSection, PageSectionItem                | `modules/page/entities/`                                   |
| `slug.ts`    | SlugResolveResponse, SlugType                     | `modules/slug/`                                            |
| `cart.ts`    | CartItem, Cart                                    | Client-side only                                           |
| `order.ts`   | Order, CreateOrderDto, OrderItem                  | `modules/order/`                                           |
| `common.ts`  | PaginatedResponse, ApiErrorResponse, SearchParams | Common DTOs                                                |

## Cách dùng

```ts
import type { Product, Category } from "@/types";
```

## Quy tắc

1. **Import từ barrel** — `import type { Product } from "@/types"` (KHÔNG import từ file riêng)
2. **`type` import** — luôn dùng `import type` cho type-only imports
3. **Naming** — PascalCase cho interfaces, không prefix `I` (dùng `Product`, KHÔNG dùng `IProduct`)
4. **Mapped từ Backend** — giữ đồng bộ với Backend entities. Khi BE thay đổi, cập nhật types
5. **Thêm type mới** — tạo file riêng theo domain, export trong `index.ts`
