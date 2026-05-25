import type { Route } from "next";
import { notFound, redirect } from "next/navigation";

import Breadcrumb from "@/components/common/Breadcrumb";
import ParseHtmlContent from "@/components/common/ParseHtmlContent";
import { API, ApiError, api } from "@/lib/api";
import { CACHE_TAGS } from "@/lib/constants";
import type { PolicyDetail, PolicyTreeNode } from "@/types";

import PolicyMobileNav from "./PolicyMobileNav";
import PolicySidebar from "./PolicySidebar";
import PolicyStickyAside from "./PolicyStickyAside";

const REVALIDATE_SECONDS = 21600; // 6 hours

interface Props {
	slug: string;
}

async function fetchTree(): Promise<PolicyTreeNode[]> {
	try {
		return await api.get<PolicyTreeNode[]>(API.POLICIES.TREE, {
			next: {
				revalidate: REVALIDATE_SECONDS,
				tags: [CACHE_TAGS.POLICY, CACHE_TAGS.POLICIES_TREE],
			},
		});
	} catch {
		return [];
	}
}

async function fetchPolicy(slug: string): Promise<PolicyDetail | null> {
	try {
		return await api.get<PolicyDetail>(API.POLICIES.BY_SLUG(slug), {
			next: {
				revalidate: REVALIDATE_SECONDS,
				tags: [CACHE_TAGS.POLICY, CACHE_TAGS.policyBySlug(slug)],
			},
		});
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) return null;
		throw err;
	}
}

export default async function PolicyPageWrapper({ slug }: Props) {
	const [policy, tree] = await Promise.all([fetchPolicy(slug), fetchTree()]);

	if (!policy) notFound();

	const hasContent = !!policy.content?.trim();
	const firstChild = policy.children?.[0];

	// Parent có children nhưng không có nội dung riêng → chuyển sang child đầu tiên
	if (!hasContent && firstChild) {
		redirect(
			`/${firstChild.slug.replace(/\.html$/, "")}` as Route,
		);
	}

	const breadcrumbItems = [
		{ label: "Trang chủ", href: "/" },
		{ label: policy.title },
	];

	return (
		<div className="container-inner py-2 md:py-4">
			<Breadcrumb items={breadcrumbItems} className="mb-2 md:mb-4" />

			<PolicyMobileNav
				tree={tree}
				activeSlug={policy.slug}
				activeTitle={policy.title}
			/>

			<div className="mt-2 grid grid-cols-1 gap-2 md:gap-4 lg:mt-0 lg:grid-cols-[280px_minmax(0,1fr)]">
				<aside className="hidden lg:block">
					<PolicyStickyAside className="overflow-y-auto rounded-lg bg-white p-2">
						<PolicySidebar tree={tree} activeSlug={policy.slug} />
					</PolicyStickyAside>
				</aside>

				<main className="min-w-0">
					<article className="rounded-xl md:rounded-lg bg-white p-2 md:p-4">
						<header className="mb-2 md:mb-4">
							<h1 className="text-base md:text-lg font-semibold text-gray-900">
								{policy.title}
							</h1>
							{policy.description && (
								<p className="mt-2 text-sm text-gray-600">
									{policy.description}
								</p>
							)}
						</header>

						{hasContent && policy.content ? (
							<ParseHtmlContent
								html={policy.content}
								containerClassName=""
								contentClassName="flex flex-col gap-2 md:gap-4"
							/>
						) : (
							<p className="text-sm text-gray-500">
								Nội dung đang được cập nhật.
							</p>
						)}
					</article>
				</main>
			</div>
		</div>
	);
}
