import { Homepage } from "./defintions";

interface QueryResponse {
	data: Homepage;
	meta: {};
}

export async function fetchHomepageData(): Promise<Homepage> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/homepage?populate=*`);
	if (!response.ok) {
		throw new Error('Failed to fetch homepage data');
	}

	const json = await response.json() as QueryResponse;
	return json.data;
}