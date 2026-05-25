import type { ReactNode } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/common/Breadcrumb";
import { CONTACT, STORE_INFO } from "@/lib/constants/site-info";

interface PolicyPageLayoutProps {
	breadcrumbLabel: string;
	heading: string;
	subheading?: string;
	children: ReactNode;
	/** Bật/tắt khối "Thông tin liên hệ" cuối trang (default true) */
	showContactBlock?: boolean;
}

/**
 * Layout chung cho các trang chính sách / FAQ / điều khoản.
 * Đảm bảo cấu trúc + styling đồng nhất giữa các trang tĩnh.
 */
export default function PolicyPageLayout({
	breadcrumbLabel,
	heading,
	subheading,
	children,
	showContactBlock = true,
}: PolicyPageLayoutProps) {
	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container-inner py-4">
				<Breadcrumb
					items={[
						{ label: "Trang chủ", href: "/" },
						{ label: breadcrumbLabel },
					]}
				/>
			</div>

			<article className="pb-10 md:pb-14">
				<div className="container-inner">
					<div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4 md:p-6">
						<header className="mb-10 md:mb-12">
							<h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
								{heading}
							</h1>
							{subheading && (
								<p className="mt-3 text-sm text-gray-500">
									{subheading}
								</p>
							)}
						</header>

						<div className="max-w-none space-y-10 text-gray-700">
							{children}

							{showContactBlock && (
								<section>
									<h2 className="text-xl font-bold text-gray-900">
										Thông tin liên hệ
									</h2>
									<p className="mt-3 leading-relaxed">
										Mọi thắc mắc vui lòng liên hệ:
									</p>
									<div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-5 text-gray-800">
										<p className="font-semibold text-gray-900">
											Ắc Quy HN
										</p>
										<p className="mt-2">
											Hotline:{" "}
											<a
												href={`tel:${CONTACT.hotlineTel}`}
												className="font-medium text-blue-600 hover:underline"
											>
												{CONTACT.hotlineDisplay}
											</a>
										</p>
										<p className="mt-2">
											Email:{" "}
											<a
												href={`mailto:${CONTACT.email}`}
												className="font-medium text-blue-600 hover:underline"
											>
												{CONTACT.email}
											</a>
										</p>
										<p className="mt-2">
											Địa chỉ: {STORE_INFO.address}
										</p>
										<p className="mt-4 text-sm">
											<Link
												href="/gioi-thieu"
												className="text-blue-600 hover:underline"
											>
												→ Trang giới thiệu
											</Link>
										</p>
									</div>
								</section>
							)}
						</div>
					</div>
				</div>
			</article>
		</div>
	);
}

/** Helper SEO — build canonical từ env */
export function buildCanonical(path: string): string | undefined {
	const base = process.env.NEXT_PUBLIC_APP_URL;
	if (!base) return undefined;
	return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
