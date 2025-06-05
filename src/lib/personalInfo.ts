import { PersonalInfo } from "./defintions";
import qs from 'qs';

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
	const query = qs.stringify({
		populate: true,
	}, { encodeValuesOnly: true });
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/personal-info?${query}`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('Failed to fetch personal data');
	}

	const json = await response.json() as QueryResponse;
	return json.data;
}