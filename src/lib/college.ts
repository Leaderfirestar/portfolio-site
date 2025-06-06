import { College } from "./defintions";
import qs from "qs";

interface QueryResponse {
	data: College[];
	meta: {};
}

/**
 * Fetches colleges and their related documents
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @returns The college info and all related documents
 */
export async function fetchCollegeInfo(): Promise<College[]> {
	const query = qs.stringify({
		populate: true,
	}, { encodeValuesOnly: true });
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/colleges?${query}`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Failed to fetch college data");
	}
	const json = await response.json() as QueryResponse;
	return json.data;
}