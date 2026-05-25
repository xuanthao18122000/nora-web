import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CategoryPageWrapper } from "@/components/feature/category";
import {
	PostDetailPageWrapper,
	PostListPageWrapper,
} from "@/components/feature/post";
import ProductPageWrapper from "@/components/feature/product/views/product-page-wrapper";
import { API, ApiError, api } from "@/lib/api";
import { envConfig } from "@/lib/configs/env";
import { type SlugResolveResponse, SlugTypeEnum } from "@/types/slug";

/**
 * Dedup `/fe/resolve` trong cùng 1 request bằng React `cache()`.
 * `generateMetadata` + page component cùng gọi với fullSlug giống nhau →
 * chỉ trigger 1 lần (BE chỉ +1 view thay vì +2-+3).
 */
const resolveSlugCached = cache(async (fullSlug: string) => {
	return api.get<SlugResolveResponse>(API.CMS.RESOLVE(fullSlug), {
		cache: "no-store",
	});
});

/**
 * Catch-all Slug Resolver — 1-Step Flow
 *
 * GET /fe/resolve?slug=xxx → trả `{ type, entityId, slug, product, category, post, page }`.
 * BE đã populate detail entity tương ứng → wrapper render thẳng, không call thêm.
 */

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const fullSlug = slug.join("/");
	if (slug[0]?.startsWith(".")) return {};

	const canonicalSlug = fullSlug.endsWith(".html")
		? fullSlug.slice(0, -5)
		: fullSlug;
	const base = (
		envConfig.NEXT_PUBLIC_APP_URL || "https://acquyhn.example.com"
	).replace(/\/$/, "");

	// Best-effort SEO meta cho mọi entity type. Fallback theo thứ tự:
	//   metaTitle/metaDescription → name/title gốc → mặc định.
	let title: string | undefined;
	let description: string | undefined;
	let ogImage: string | undefined;
	try {
		const resolved = await resolveSlugCached(fullSlug);
		if (resolved.type === SlugTypeEnum.POST && resolved.post) {
			title = resolved.post.metaTitle ?? resolved.post.title;
			description =
				resolved.post.metaDescription ??
				resolved.post.shortDescription ??
				undefined;
			ogImage = resolved.post.featuredImage ?? undefined;
		} else if (resolved.type === SlugTypeEnum.POST_LIST && resolved.postList) {
			title = resolved.postList.name;
			description = resolved.postList.description ?? undefined;
		} else if (resolved.type === SlugTypeEnum.CATEGORY && resolved.category) {
			title =
				resolved.category.metaTitle ??
				`${resolved.category.name} | Ắc Quy HN`;
			description =
				resolved.category.metaDescription ??
				resolved.category.description ??
				`Mua ${resolved.category.name} chính hãng tại Ắc Quy HN — giá tốt, bảo hành dài hạn, thay tận nơi 24/7 tại Thủ Đức và TP.HCM.`;
			ogImage =
				resolved.category.thumbnailUrl ??
				resolved.category.iconUrl ??
				undefined;
		} else if (resolved.type === SlugTypeEnum.PRODUCT && resolved.product) {
			title =
				resolved.product.metaTitle ??
				`${resolved.product.name} | Ắc Quy HN`;
			description =
				resolved.product.metaDescription ??
				resolved.product.shortDescription ??
				`Mua ${resolved.product.name} chính hãng — bảo hành chính hãng, thay tận nơi tại Thủ Đức và TP.HCM.`;
			ogImage = resolved.product.thumbnailUrl ?? undefined;
		} else if (resolved.type === SlugTypeEnum.PAGE && resolved.page) {
			// `ResolvedPage` có `[key: string]: unknown` index signature làm
			// các field optional bị widen thành `unknown` → cast về shape cụ thể.
			const p = resolved.page as {
				metaTitle?: string | null;
				title?: string | null;
				metaDescription?: string | null;
				seoImage?: string | null;
			};
			title = p.metaTitle ?? p.title ?? undefined;
			description = p.metaDescription ?? undefined;
			ogImage = p.seoImage ?? undefined;
		}
	} catch {
		// ignore — metadata optional
	}

	return {
		title,
		description,
		alternates: { canonical: `${base}/${canonicalSlug}` },
		openGraph: {
			title,
			description,
			url: `${base}/${canonicalSlug}`,
			...(ogImage ? { images: [{ url: ogImage }] } : {}),
		},
	};
}

export default async function SlugResolver({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string[] }>;
	searchParams: Promise<{
		page?: string;
		limit?: string;
		sort?: string;
		sku?: string;
	}>;
}) {
	const { slug } = await params;
	const fullSlug = slug.join("/");

	if (slug[0]?.startsWith(".")) notFound();

	let resolved: SlugResolveResponse;
	try {
		resolved = await resolveSlugCached(fullSlug);
	} catch (error) {
		if (error instanceof ApiError && error.status === 404) notFound();
		console.error(
			`[SlugResolver] Failed to resolve slug "${fullSlug}"`,
			error,
		);
		notFound();
	}

	switch (resolved.type) {
		case SlugTypeEnum.CATEGORY: {
			if (!resolved.category) notFound();
			const sp = await searchParams;
			return (
				<CategoryPageWrapper
					slug={fullSlug}
					category={resolved.category}
					searchParams={sp}
				/>
			);
		}

		case SlugTypeEnum.PRODUCT: {
			if (!resolved.product) notFound();
			return (
				<ProductPageWrapper
					slug={fullSlug}
					product={resolved.product}
				/>
			);
		}

		case SlugTypeEnum.PAGE:
			return (
				<div className="container-inner py-8">
					<h1 className="text-2xl font-semibold text-gray-900">
						Trang: {fullSlug}
					</h1>
					<p className="mt-2 text-md text-gray-500">
						CmsPage — Coming soon
					</p>
					<pre className="mt-4 bg-white rounded p-4 text-xs overflow-auto">
						{JSON.stringify(resolved.page, null, 2)}
					</pre>
				</div>
			);

		case SlugTypeEnum.POST: {
			if (!resolved.post) notFound();
			return <PostDetailPageWrapper post={resolved.post} />;
		}

		case SlugTypeEnum.POST_LIST: {
			if (!resolved.postList) notFound();
			const sp = await searchParams;
			return (
				<PostListPageWrapper
					postList={resolved.postList}
					searchParams={sp}
				/>
			);
		}

		default:
			notFound();
	}
}
