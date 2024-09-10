import { PersonalInfo } from "./defintions";

interface QueryResponse {
	data: PersonalInfo;
	meta: {};
}

export async function fetchPersonalInfo(): Promise<PersonalInfo> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/personal-info?populate=*`);
	if (!response.ok) {
		throw new Error('Failed to fetch homepage data');
	}

	const json = await response.json() as QueryResponse;
	return json.data;
}