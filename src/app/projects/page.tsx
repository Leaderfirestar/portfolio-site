import styles from "./page.module.css";
import { Project } from "@/lib/defintions";
import { fetchProjectPage } from "@/lib/projectPage";
import { fetchProjects } from "@/lib/projects";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
	const projectPage = await fetchProjectPage();
	return projectPage.attributes.page_metadatum.data.attributes;
}

async function Projects() {
	const [projects, projectPage] = await Promise.all([fetchProjects(), fetchProjectPage()]);
	const finalProjectListElements = buildProjectList(projects);
	return (
		<div>
			<div className={styles.titleContainer}>
				<h1>{projectPage.attributes.name}</h1>
				<h2>{projectPage.attributes.description}</h2>
			</div>
			<ul className={styles.projectList}>
				{finalProjectListElements}
			</ul>
		</div>
	);
}

export default Projects;

/**
 * Given the projects from the database, builds each of them into JSX to be rendered on the page
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @param projects The projects I have published in strapi
 * @returns The project list elements to render on the page
 */
function buildProjectList(projects: Project[]) {
	const finalProjectListElements = [];
	for (const proj of projects) {
		if (proj.attributes.image.data) {
			finalProjectListElements.push(
				<li
					key={proj.id}
					className={styles.projectListItem}
				>
					<a
						href={`/projects/${proj.attributes.slug}`}
						className={styles.projectListItemAnchor}
					>
						<div className={styles.imageContainer}>
							<Image
								src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${proj.attributes.image.data?.attributes.url}`}
								width={proj.attributes.image.data.attributes.width}
								height={proj.attributes.image.data.attributes.height}
								alt={proj.attributes.image.data?.attributes.alternativeText}
							/>
						</div>
						<h3 className={styles.projectListItemH3}>{proj.attributes.title}</h3>
						<div className={styles.projectInfo}>
							<p>{proj.attributes.shortDescription}</p>
						</div>
					</a>
				</li>
			);
		}
	}
	return finalProjectListElements;
}
