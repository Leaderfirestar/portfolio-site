import { Project, StrapiFindResponse, StrapiSingleThingResponse } from "./defintions";

export async function fetchProjects(): Promise<Project[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?populate=*&sort=sortIndex:asc`);
	const json = await response.json() as StrapiFindResponse<Project>;
	if (json.data) return json.data;
	console.error(json.error);
	return [];
}

export async function fetchProject(id: string) { }

export async function fetchProjectBySlug(slug: string): Promise<StrapiSingleThingResponse<Project>> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?filters[slug][$eq]=${slug}&populate[image]=*&populate[gallery]=*&populate[technologies][populate]=logo&populate[technologies][sort]=name:asc&populate[page_metadatum]=*`);
	const json = await response.json() as StrapiSingleThingResponse<Project>;
	return json;
}