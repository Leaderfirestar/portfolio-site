import { Project, StrapiFindResponse, StrapiSingleThingResponse } from "./defintions";

/**
 * Fetches all published projects from strapi. Orders them by the sortIndex
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @returns The projects, sorted how I define in strapi
 */
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
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?populate[image]=*&populate[gallery]=*&populate[technologies][populate]=logo&populate[technologies][sort]=name:asc&populate[page_metadata]=*`);
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
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?filters[slug][$eq]=${slug}&populate[image]=*&populate[gallery]=*&populate[technologies][populate]=logo&populate[technologies][sort]=name:asc&populate[page_metadata]=*`);
	const json = await response.json() as StrapiSingleThingResponse<Project>;
	return json;
}