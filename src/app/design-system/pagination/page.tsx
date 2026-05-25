"use client";

import { Pagination } from "@/components/common";

import CodeSnippet from "../CodeSnippet";

export default function PaginationPage() {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-2">
				Pagination
			</h1>
			<p className="text-gray-600 mb-8">
				Page navigation for product or listing pages.
			</p>
			<div className="flex flex-col gap-6">
				<div>
					<p className="text-sm text-gray-500 mb-2">Page 1 of 10</p>
					<Pagination
						currentPage={1}
						totalPages={10}
						onPageChange={() => {}}
					/>
				</div>
				<div>
					<p className="text-sm text-gray-500 mb-2">Page 5 of 10</p>
					<Pagination
						currentPage={5}
						totalPages={10}
						onPageChange={() => {}}
					/>
				</div>
				<div>
					<p className="text-sm text-gray-500 mb-2">Page 10 of 10</p>
					<Pagination
						currentPage={10}
						totalPages={10}
						onPageChange={() => {}}
					/>
				</div>
			</div>
			<CodeSnippet
				code={`import { Pagination } from "@/components/common";

<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log(page)}
/>`}
			/>
		</div>
	);
}
