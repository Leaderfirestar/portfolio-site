import { Resume } from "./defintions";

interface QueryResponse {
	data: Resume;
	meta: {};
}

/**
 * Fetches all data related to the resume from the db
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @returns The resume data and all related documents
 */
export async function fetchResume(): Promise<Resume> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/resume?populate[colleges][populate]=*&populate[employers][populate]=*&populate[technologies]=*&populate[projects]=*&populate[page_metadata]=*&populate[resume]=*`);
	if (!response.ok) {
		throw new Error('Failed to fetch resume data');
	}

	const json = await response.json() as QueryResponse;
	return json.data;
}