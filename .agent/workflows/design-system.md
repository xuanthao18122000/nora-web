---
description: DDV Store FE — Design System rules & how to use it correctly
---

# DDV Design System — Quy tắc sử dụng

Design system được định nghĩa trong:
- `src/app/globals.css` — Tailwind v4 `@theme` tokens
- Source Figma: https://www.figma.com/design/awotz0BcIpL1s1YFZoXMP2

---

## 1. Màu sắc (Colors)

**KHÔNG dùng** hex color trực tiếp trong className. **Luôn dùng** Tailwind token đã mapping.

### Primary (màu thương hiệu — đỏ DDV)
| Token | Hex | Dùng cho |
|---|---|---|
| `primary-50` | `#F9E9EA` | Background nhẹ, applied voucher row |
| `primary-100` | `#EBB9BE` | Hover nhẹ |
| `primary-500` | `#BE1E2D` | Màu chính: button, icon, giá, badge |
| `primary-600` | `#AD1B29` | Hover trạng thái button primary |
| `primary-700` | `#871520` | Pressed |

### Gray (màu trung tính)
| Token | Hex | Dùng cho |
|---|---|---|
| `gray-50` | `#F9FAFB` | Background input, row nhạt |
| `gray-100` | `#F3F4F6` | Background page, skeleton |
| `gray-200` | `#E5E7EB` | Border mặc định, divider |
| `gray-300` | `#D1D5DC` | Border strong, radio unselected |
| `gray-400` | `#99A1AF` | Text muted, giá gốc gạch |
| `gray-500` | `#6A7282` | Text secondary / subtitle |
| `gray-600` | `#4A5565` | Text body phụ |
| `gray-700` | `#364153` | Text đậm |
| `gray-900` | `#101B2B` | Text primary (thay `#101828`) |

### Green
| Token | Hex | Dùng cho |
|---|---|---|
| `green-50` | `#F0FDF4` | Background success nhạt |
| `green-100` | `#DCFCE7` | Background COD icon |
| `green-500` | `#00C950` | Icon tick, trạng thái thành công |

### Blue
| Token | Hex | Dùng cho |
|---|---|---|
| `blue-500` | `#2B7FFF` | Link, icon địa chỉ, chữ "Thay đổi" |

### Orange / Yellow / Red — dùng đúng scale tương tự

---

## 2. Semantic Aliases (dùng cho layout/page)

Những class này wrap CSS variable, dùng khi cần **tương thích theme**:

| Tailwind class | CSS variable | Hex | Dùng cho |
|---|---|---|---|
| `bg-bg-page` | `--color-bg-page` | `#F3F4F6` | Background toàn trang |
| `bg-bg-card` | `--color-bg-card` | `#FFFFFF` | Card background |
| `text-text-primary` | `--color-text-primary` | `#101828` | Text chính |
| `text-text-secondary` | `--color-text-secondary` | `#4A5565` | Text phụ |
| `text-text-tertiary` | `--color-text-tertiary` | `#6A7282` | Text nhạt hơn |
| `text-text-muted` | `--color-text-muted` | `#99A1AF` | Text muted |
| `text-text-price` | `--color-text-price` | `#BE1E2D` | Giá sản phẩm |
| `text-text-link` | `--color-text-link` | `#2B7FFF` | Link, action text |
| `border-border-default` | `--color-border-default` | `#E5E7EB` | Border thông thường |
| `border-border-strong` | `--color-border-strong` | `#D1D5DC` | Border nổi |
| `border-border-primary` | `--color-border-primary` | `#BE1E2D` | Border selected/focus |

> **Ưu tiên dùng semantic alias** (`bg-bg-page`) hơn là scale (`bg-gray-100`) để sau này đổi theme dễ hơn.

---

## 3. Typography

**Font gia đình:** `SF Pro Display` (đã khai báo trong `body`), không cần set lại.

| Token class | rem | Dùng cho |
|---|---|---|
| `text-xxs` | 0.625rem | Badge nhỏ |
| `text-xs` | 0.75rem | Label nhỏ, badge |
| `text-sm` | 0.875rem | Body nhỏ, input |
| `text-md` | 1rem | Body thường (default) |
| `text-lg` | 1.125rem | Heading section |
| `text-xl` | 1.25rem | Heading trang |
| `text-2xl` | 1.5rem | Heading lớn |

**Font weight:** dùng Tailwind standard `font-normal`, `font-medium`, `font-semibold`, `font-bold`.

---

## 4. Spacing

Dựa trên **4px grid**. Dùng Tailwind standard `p-`, `m-`, `gap-` với các bước: `0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 16`.

---

## 5. Border Radius

| Token | px | Class Tailwind |
|---|---|---|
| `radius-xs` | 4px | `rounded` hoặc `rounded-sm` |
| `radius-sm` | 8px | `rounded-lg` |
| `radius-md` | 16px | `rounded-2xl` |
| `radius-full` | 99px | `rounded-full` |

---

## 6. Shadows

| Token | Dùng cho |
|---|---|
| `shadow-sm` | Card nhỏ, subtle |
| `shadow-card` | Card chính |

---

## 7. Utility Classes (defined in globals.css)

| Class | Mục đích |
|---|---|
| `.text-price` | Hiển thị giá bán (đỏ + semibold) |
| `.text-price-old` | Giá gốc (gạch ngang, muted) |
| `.text-discount` | Phần trăm giảm giá |
| `.badge-offer` | Badge khuyến mãi xám |
| `.badge-new` | Badge "Mới" đỏ nhạt |
| `.badge-online` | Badge "Online" xanh |
| `.container-inner` | Layout container (max 1200px, centered) |
| `.container-padding` | Chỉ padding responsive, không max-width |
| `.safe-top` / `.safe-bottom` | Notch/home indicator padding |
| `.scrollbar-hide` | Ẩn scrollbar nhưng vẫn scroll được |

---

## 8. Quy tắc AI khi code UI

1. **Không dùng hex** trong `className` (ví dụ `bg-[#BE1E2D]` → dùng `bg-primary-500`)
2. **Không dùng arbitrary value** nếu đã có token (ví dụ `text-[#6A7282]` → dùng `text-gray-500` hoặc `text-text-tertiary`)
3. **Màu brand chính** luôn dùng `primary-*`
4. **Background trang** luôn dùng `bg-bg-page`
5. **Button primary:** `bg-primary-500 hover:bg-primary-600 text-white`
6. **Border mặc định:** `border-gray-200` (hoặc `border-border-default`)
7. **Input focus:** `focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20`
8. **Text phụ / subtitle:** `text-gray-500` hoặc `text-text-tertiary`
9. **Text giá:** dùng `.text-price` class hoặc `text-primary-500 font-semibold`
10. **Skeleton / loading bg:** `bg-gray-100 animate-pulse`
11. **z-index modal:** Backdrop `z-200`, Sheet/Modal `z-201` (không dùng `z-[200]`)

---

## 9. Component patterns chuẩn

### Button Primary
```tsx
<button className="rounded-xl bg-primary-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-600 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40">
```

### Button Secondary (outline)
```tsx
<button className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50">
```

### Input
```tsx
<input className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 placeholder:text-gray-400" />
```

### Card
```tsx
<div className="rounded-2xl bg-white shadow-card px-4 py-3">
```

### Badge giá giảm
```tsx
<span className="text-price">{formatPrice(price)}</span>
<span className="text-price-old">{formatPrice(originalPrice)}</span>
```

### Error text
```tsx
<p className="text-sm text-red-500">{error}</p>
```

### Divider
```tsx
<div className="h-px bg-gray-100" />
```

---

## 10. Linting

Project dùng **Tailwind CSS linter** sẽ warn khi dùng arbitrary value thay vì token. Khi thấy warning dạng:
> `The class \`bg-[#BE1E2D]\` can be written as \`bg-primary-500\``

→ Luôn sửa theo gợi ý của linter.
