import { Project, StrapiFindResponse, StrapiSingleThingResponse } from "./defintions";
import qs from 'qs';

/**
 * Fetches all published projects from strapi. Orders them by the sortIndex
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @returns The projects, sorted how I define in strapi
 */
export async function fetchProjects(): Promise<Project[]> {
	const query = qs.stringify({
		populate: {
			image: true,
		},
		sort: ['sortIndex:asc'],
	}, { encodeValuesOnly: true });

	const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?${query}`;
	const response = await fetch(url);
	const json = await response.json() as StrapiFindResponse<Project>;
	console.log(`json data`, json.data);
	if (json.data) return json.data;
	console.error(json.error);
	return [];
}

/**
 * Fetches all projects so that we can pre-generate all project pages during build time
 * @author Eric Webb <ewebb@factorearth.com>
 * @returns All projects
 */
export async function fetchProjectsForBuildTimeGeneration(): Promise<Project[]> {
	const query = qs.stringify({
		populate: {
			image: true,
			gallery: true,
			technologies: {
				populate: ['logo'],
				sort: ['name:asc'],
			},
			page_metadata: true,
		},
	}, { encodeValuesOnly: true });
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?${query}`;
	const response = await fetch(url);
	const responseJson = await response.json() as StrapiFindResponse<Project>;
	if (responseJson.data) return responseJson.data;
	return [];
}

/**
 * Given a slug, fetches the project and all its children by the slug
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @param slug The slug of the project
 * @returns The project with that slug
 */
export async function fetchProjectBySlug(slug: string): Promise<StrapiSingleThingResponse<Project>> {
	const query = qs.stringify({
		filters: {
			slug: {
				$eq: slug,
			},
		},
		populate: {
			image: true,
			gallery: true,
			technologies: {
				populate: ['logo'],
				sort: ['name:asc'],
			},
			page_metadata: true,
		},
	}, { encodeValuesOnly: true });
	const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?${query}`;
	const response = await fetch(url);
	const json = await response.json() as StrapiSingleThingResponse<Project>;
	return json;
}