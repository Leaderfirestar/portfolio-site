import { Project, StrapiFindResponse, StrapiSingleThingResponse } from "./defintions";

export async function fetchProjects(): Promise<Project[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?populate=*&sort=sortIndex:asc`);
	const json = await response.json() as StrapiFindResponse<Project>;
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
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?populate[image]=*&populate[gallery]=*&populate[technologies][populate]=logo&populate[technologies][sort]=name:asc&populate[page_metadatum]=*`);
	const responseJson = await response.json() as StrapiFindResponse<Project>;
	if (responseJson.data) return responseJson.data;
	return [];
}

export async function fetchProjectBySlug(slug: string): Promise<StrapiSingleThingResponse<Project>> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?filters[slug][$eq]=${slug}&populate[image]=*&populate[gallery]=*&populate[technologies][populate]=logo&populate[technologies][sort]=name:asc&populate[page_metadatum]=*`);
	const json = await response.json() as StrapiSingleThingResponse<Project>;
	return json;
}