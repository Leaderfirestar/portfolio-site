import { fetchProjects } from "@/lib/projects";

async function Projects() {
	const projects = await fetchProjects();
	console.log('PROJECTS', projects);
	return <h1>Hi</h1>;
}

export default Projects;