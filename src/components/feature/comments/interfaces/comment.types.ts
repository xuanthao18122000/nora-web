export interface Reply {
	id: string;
	name: string;
	initial: string;
	isAdmin: boolean;
	time: string;
	content: string;
}

export interface Comment {
	id: string;
	name: string;
	initial: string;
	time: string;
	content: string;
	replies: Reply[];
	totalReplies: number;
}
