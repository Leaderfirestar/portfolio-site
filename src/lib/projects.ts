import { Project, SingularThing, StrapiFindResponse, StrapiSingleThingResponse } from "./defintions";

export async function fetchProjects(): Promise<Project[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?populate=*`);
	const json = await response.json() as StrapiFindResponse<Project>;
	if (json.data) return json.data;
	console.error(json.error);
	return [];
}

export async function fetchProject(id: string) { }

export async function fetchProjectBySlug(slug: string): Promise<SingularThing<Project> | void> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/projects?filters[slug][$eq]=${slug}&populate[technologies][populate]=logo&populate[technologies][sort][0]=name:asc&populate=image,gallery`);
	const json = await response.json() as StrapiSingleThingResponse<Project>;
	if (!json.data) {
		console.error(json.error);
	}
	if (json.data && json.data.length > 0) return json.data[0];
}