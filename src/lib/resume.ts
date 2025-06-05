import { Resume } from "./defintions";
import qs from "qs";

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
	const query = qs.stringify({
		populate: {
			colleges: {
				populate: {
					degrees: true
				},
			},
			employers: {
				populate: {
					accomplishments: true,
				},
			},
			technologies: true,
			projects: true,
			page_metadata: true,
			resume: true,
		},
	}, { encodeValuesOnly: true });
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/resume?${query}`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Failed to fetch resume data');
	}

	const json = await response.json() as QueryResponse;
	return json.data;
}