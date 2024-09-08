import { Project } from "@/lib/defintions";
import { fetchProjectPage } from "@/lib/projectPage";
import { fetchProjects } from "@/lib/projects";
import Image from "next/image";

async function Projects() {
	const [projects, projectPage] = await Promise.all([fetchProjects(), fetchProjectPage()]);
	const finalProjectListElements = buildProjectList(projects);
	return (
		<div>
			<div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
				<h1>{projectPage.attributes.name}</h1>
				<h2>{projectPage.attributes.description}</h2>
			</div>
			<ul style={{ padding: "0px", display: "grid", gridTemplateColumns: "30% 30% 30%", columnGap: "5%" }}>
				{finalProjectListElements}
			</ul>
		</div>
	);
}

export default Projects;

function buildProjectList(projects: Project[]) {
	const finalProjectListElements = [];
	for (const proj of projects) {
		if (proj.attributes.image.data) {
			finalProjectListElements.push(
				<li
					key={proj.id}
					style={{
						listStyleType: "none",
						display: "flex",
						flexDirection: "column",
						alignItems: "center"
					}}
				>
					<Image
						src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${proj.attributes.image.data?.attributes.url}`}
						width={proj.attributes.image.data.attributes.width}
						height={proj.attributes.image.data.attributes.height}
						alt={proj.attributes.image.data?.attributes.alternativeText} />
					<a
						href={`/projects/${proj.attributes.slug}`}
					>
						{proj.attributes.title}
					</a>
				</li>
			);
		}
	}
	return finalProjectListElements;
}
