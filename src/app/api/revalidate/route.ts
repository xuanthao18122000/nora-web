import crypto from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET = process.env.REVALIDATE_SECRET ?? "";

interface RevalidateBody {
	tags?: string[];
	paths?: string[];
}

const timingSafeEqual = (a: string, b: string): boolean => {
	const bufA = Buffer.from(a);
	const bufB = Buffer.from(b);
	if (bufA.length !== bufB.length) return false;
	return crypto.timingSafeEqual(bufA, bufB);
};

export async function POST(req: NextRequest) {
	if (!SECRET) {
		return NextResponse.json(
			{ error: "REVALIDATE_SECRET chưa cấu hình trên storefront" },
			{ status: 500 },
		);
	}

	const provided = req.headers.get("x-revalidate-secret") ?? "";
	if (!timingSafeEqual(provided, SECRET)) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}

	const body = (await req.json().catch(() => null)) as RevalidateBody | null;
	if (!body || (!body.tags?.length && !body.paths?.length)) {
		return NextResponse.json(
			{ error: "Cần truyền 'tags' hoặc 'paths'" },
			{ status: 400 },
		);
	}

	const tags = body.tags ?? [];
	const paths = body.paths ?? [];

	for (const tag of tags) {
		if (typeof tag === "string" && tag.length > 0) {
			// `{ expire: 0 }` evicts the cache entry immediately. Named profile
			// "default" only marks it stale (still served once before refresh),
			// so a single F5 would not show fresh data.
			revalidateTag(tag, { expire: 0 });
		}
	}
	for (const path of paths) {
		if (typeof path === "string" && path.length > 0) {
			revalidatePath(path);
		}
	}

	return NextResponse.json({
		revalidated: true,
		tags,
		paths,
		now: Date.now(),
	});
}
