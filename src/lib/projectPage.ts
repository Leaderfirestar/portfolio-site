import { ProjectPage } from "./defintions";

interface QueryResponse {
	data: ProjectPage;
	meta: {};
}

export async function fetchProjectPage(): Promise<ProjectPage> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projectpage?populate[page_metadatum]=*`);
	if (!response.ok) {
		throw new Error('Failed to fetch homepage data');
	}

	const json = await response.json() as QueryResponse;
	return json.data;
}