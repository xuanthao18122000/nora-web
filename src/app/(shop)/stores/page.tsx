import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import type { Metadata } from "next";
import { CONTACT, STORE_INFO } from "@/lib/constants/site-info";

export const metadata: Metadata = {
	title: `Cửa hàng ${STORE_INFO.name}`,
	description: STORE_INFO.address,
};

const EMBED_MAP = `https://www.google.com/maps?q=${STORE_INFO.latitude},${STORE_INFO.longitude}&z=16&output=embed`;

export default function StoresPage() {
	return (
		<section className="container-inner py-6 md:py-8 max-w-[1100px] mx-auto space-y-6">
			<header>
				<h1 className="text-2xl font-bold text-gray-900">
					Hệ thống cửa hàng
				</h1>
				<p className="mt-1 text-sm text-gray-600">
					Đến trực tiếp cửa hàng để được tư vấn và hỗ trợ tận tình.
				</p>
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
				{/* Map */}
				<div className="rounded-lg overflow-hidden bg-white aspect-[16/10] lg:aspect-auto lg:min-h-[420px] border border-gray-200">
					<iframe
						title={`Bản đồ ${STORE_INFO.name}`}
						src={EMBED_MAP}
						className="w-full h-full"
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>

				{/* Info */}
				<aside className="rounded-lg bg-white p-5 space-y-4 h-fit">
					<h2 className="text-lg font-semibold text-gray-900">
						{STORE_INFO.name}
					</h2>

					<dl className="space-y-3 text-sm">
						<div className="flex gap-2">
							<MapPin className="size-5 shrink-0 mt-0.5 text-primary-500" />
							<div>
								<dt className="text-gray-500 mb-0.5">Địa chỉ</dt>
								<dd className="text-gray-900">
									{STORE_INFO.address}
								</dd>
							</div>
						</div>

						<div className="flex gap-2">
							<Phone className="size-5 shrink-0 mt-0.5 text-primary-500" />
							<div>
								<dt className="text-gray-500 mb-0.5">Hotline</dt>
								<dd>
									<a
										href={`tel:${CONTACT.hotlineTel}`}
										className="text-red-500 font-semibold hover:underline"
									>
										{CONTACT.hotlineDisplay}
									</a>
								</dd>
							</div>
						</div>

						<div className="flex gap-2">
							<Clock className="size-5 shrink-0 mt-0.5 text-primary-500" />
							<div>
								<dt className="text-gray-500 mb-0.5">
									Giờ mở cửa
								</dt>
								<dd className="text-gray-900">
									{STORE_INFO.openingHours}
								</dd>
							</div>
						</div>
					</dl>

					<div className="grid grid-cols-2 gap-2 pt-2">
						<a
							href={STORE_INFO.googleMapsUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
						>
							<Navigation className="size-4" />
							Chỉ đường
						</a>
						<a
							href={`tel:${CONTACT.hotlineTel}`}
							className="flex items-center justify-center gap-1.5 rounded-lg bg-primary-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
						>
							<Phone className="size-4" />
							Gọi ngay
						</a>
					</div>
				</aside>
			</div>
		</section>
	);
}
