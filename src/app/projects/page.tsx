import { JsonLd, Project } from "@/lib/defintions";
import { fetchProjectPage } from "@/lib/projectPage";
import { fetchProjects } from "@/lib/projects";
import { Metadata } from "next";
import Image from "next/image";
import { CreativeWork } from "schema-dts";
import styles from "./page.module.css";
import Head from "next/head";

export async function generateMetadata(): Promise<Metadata | undefined> {
	if (process.env.VERCEL_ENV !== "production") return;
	const projectPage = await fetchProjectPage();
	const metadata: Metadata = {
		...projectPage.page_metadata,
		metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL}`),
		openGraph: {
			title: projectPage.page_metadata.title,
			description: projectPage.page_metadata.description,
			url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects`,
			siteName: projectPage.page_metadata.applicationName,
			type: "website",
		},
		twitter: {
			title: projectPage.page_metadata.title,
			description: projectPage.page_metadata.description,
			card: "summary_large_image",
		}
	};
	return metadata;
}

async function Projects() {
	const [projects, projectPage] = await Promise.all([fetchProjects(), fetchProjectPage()]);
	const finalProjectListElements = buildProjectList(projects);
	const jsonLd: JsonLd<CreativeWork> = {
		"@context": "https://schema.org",
		"@type": "Collection",
		"@graph": projects.map<CreativeWork>((project) => ({
			"@type": "CreativeWork",
			"@id": `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}#project`,
			"name": project.title,
			"description": project.shortDescription,
			"url": `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`,
			"image": `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${project.image?.url}`,
			"author": {
				"@type": "Person",
				"@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#author`,
			}
		}))
	};
	return (
		<div>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
			/>
			<div className={styles.titleContainer}>
				<h1>{projectPage.name}</h1>
				<h2>{projectPage.description}</h2>
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
		if (proj.image) {
			finalProjectListElements.push(
				<li
					key={proj.id}
					className={styles.projectListItem}
				>
					<a
						href={`/projects/${proj.slug}`}
						className={styles.projectListItemAnchor}
					>
						<div className={styles.imageContainer}>
							<Image
								src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${proj.image.url}`}
								width={proj.image.width}
								height={proj.image.height}
								alt={proj.image.alternativeText}
							/>
						</div>
						<h3 className={styles.projectListItemH3}>{proj.title}</h3>
						<div className={styles.projectInfo}>
							<p>{proj.shortDescription}</p>
						</div>
					</a>
				</li>
			);
		}
	}
	return finalProjectListElements;
}
