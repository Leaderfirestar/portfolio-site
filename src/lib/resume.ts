import { Resume } from "./defintions";

interface QueryResponse {
	data: Resume;
	meta: {};
}

export async function fetchResume(): Promise<Resume> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/resume?populate[colleges][populate]=*&populate[employers][populate]=*&populate[technologies]=*&populate[projects]=*`);
	if (!response.ok) {
		throw new Error('Failed to fetch resume data');
	}

	const json = await response.json() as QueryResponse;
	return json.data;
}