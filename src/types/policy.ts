export interface Policy {
	id: number;
	parentId?: number | null;
	title: string;
	slug: string;
	content?: string | null;
	description?: string | null;
	idPath: string;
	level: number;
	position: number;
	metaTitle?: string | null;
	metaDescription?: string | null;
	metaKeywords?: string | null;
	status: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface PolicyTreeNode extends Policy {
	children: PolicyTreeNode[];
}

export interface PolicyDetail extends Policy {
	children: Policy[];
}
