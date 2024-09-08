import { Projectpage } from "./defintions";

interface QueryResponse {
	data: Projectpage;
	meta: {};
}

export async function fetchProjectPage() {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projectpage`);
	if (!response.ok) {
		throw new Error('Failed to fetch homepage data');
	}

	const json = await response.json() as QueryResponse;
	return json.data;
}