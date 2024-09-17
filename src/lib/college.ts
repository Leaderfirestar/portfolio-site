import { College } from "./defintions";

interface QueryResponse {
	data: College[];
	meta: {};
}

export async function fetchCollegeInfo(): Promise<College[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/colleges?populate=*`);
	if (!response.ok) {
		throw new Error("Failed to fetch college data");
	}
	const json = await response.json() as QueryResponse;
	return json.data;
}