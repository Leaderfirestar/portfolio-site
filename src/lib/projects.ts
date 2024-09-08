import { Project, StrapiFindResponse, StrapiSingleThingResponse } from "./defintions";

export async function fetchProjects(): Promise<Project[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?populate=*`, {
		next: {
			revalidate: 3600
		}
	});
	const json = await response.json() as StrapiFindResponse<Project>;
	if (json.data) return json.data;
	console.error(json.error);
	return [];
}

export async function fetchProject(id: string) { }

export async function fetchProjectBySlug(slug: string): Promise<StrapiSingleThingResponse<Project>> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?populate[image]=*&populate[gallery]=*&populate[technologies][populate]=logo&populate[technologies][sort]=name:asc`);
	const json = await response.json() as StrapiSingleThingResponse<Project>;
	return json;
}