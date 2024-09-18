import { PersonalInfo } from "./defintions";

interface QueryResponse {
	data: PersonalInfo;
	meta: {};
}

/**
 * Fetches personalInfo and all related documents from the database
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @returns All personal info and related documents
 */
export async function fetchPersonalInfo(): Promise<PersonalInfo> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/personal-info?populate=*`);
	if (!response.ok) {
		throw new Error('Failed to fetch personal data');
	}

	const json = await response.json() as QueryResponse;
	return json.data;
}