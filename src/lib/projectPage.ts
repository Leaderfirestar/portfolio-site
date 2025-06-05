import { ProjectPage } from "./defintions";
import qs from 'qs';

interface QueryResponse {
	data: ProjectPage;
	meta: {};
}

/**
 * Fetches all data related to the project page from the db
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @returns The project page data
 */
export async function fetchProjectPage(): Promise<ProjectPage> {
	const query = qs.stringify({
		populate: {
			page_metadata: true,
		},
	}, { encodeValuesOnly: true });
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/project-page?${query}`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Failed to fetch project page data');
	}

	const json = await response.json() as QueryResponse;
	return json.data;
}