import { getImageUrl } from "@/lib/utils/image";
import { parseSectionItemData } from "@/lib/utils/page-sections";
import type { BannerItemData, PageSectionItem } from "@/types/page";

export interface BannerSlide {
	id: string;
	imageUrl: string;
	/** When set and different from `imageUrl`, mobile uses this (desktop keeps `imageUrl` at sm+). */
	mobileImageUrl?: string;
	alt: string;
	href?: string;
	target?: "_self" | "_blank";
	position?: number;
}

/** Merged desktop/mobile URLs per CMS position → slides for carousels. */
export function positionsToBannerSlides(
	positions: Array<{
		position: number;
		name: string;
		desktopUrl: string;
		mobileUrl: string;
		href?: string;
	}>,
): BannerSlide[] {
	return positions.map((p) => {
		const desktop = p.desktopUrl || p.mobileUrl;
		const mobile = p.mobileUrl || p.desktopUrl;
		const hasVariant = mobile !== desktop;
		return {
			id: `banner-pos-${p.position}`,
			imageUrl: desktop,
			mobileImageUrl: hasVariant ? mobile : undefined,
			alt: p.name,
			href: p.href,
			position: p.position,
		};
	});
}

export function toBannerSlides(items: PageSectionItem[]): BannerSlide[] {
	return items
		.sort((a, b) => a.position - b.position)
		.map((item) => {
			const d = parseSectionItemData<BannerItemData>(item);
			// `item.data` có thể là JSON object hoặc string path trực tiếp
			// (BannerSection lưu data = path string khi không có field phụ)
			const rawString =
				typeof item.data === "string" && !d ? item.data : null;
			const rawUrl = d?.imageUrl ?? d?.image ?? rawString;
			if (!rawUrl) return null;
			const imageUrl = getImageUrl(rawUrl);
			if (!imageUrl) return null;
			const rawTarget =
				(
					d as unknown as {
						linkTarget?: unknown;
						link_target?: unknown;
					}
				)?.linkTarget ??
				(
					d as unknown as {
						linkTarget?: unknown;
						link_target?: unknown;
					}
				)?.link_target ??
				(d as unknown as { target?: unknown })?.target;
			const target: BannerSlide["target"] =
				rawTarget === "_blank"
					? "_blank"
					: rawTarget === "_self"
						? "_self"
						: undefined;
			return {
				id: String(item.id),
				imageUrl,
				alt: item.name || "Banner",
				href: d?.link ?? item.targetUrl,
				target,
				position: item.position,
			};
		})
		.filter((s): s is NonNullable<typeof s> => s !== null);
}
