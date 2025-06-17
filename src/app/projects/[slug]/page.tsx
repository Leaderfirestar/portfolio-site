import Carousel from '@/components/Carousel';
import RichTextRenderer from '@/components/RichTextRenderer';
import { fetchProjectBySlug, fetchProjectsForBuildTimeGeneration } from '@/lib/projects';
import { Metadata } from 'next';
import Image from 'next/image';
import styles from "./page.module.css";
import { JsonLd } from '@/lib/defintions';
import { CreativeWork } from 'schema-dts';
import Head from 'next/head';

type Params = Promise<{ slug: string; }>;

export const generateMetadata = async ({ params }: { params: Params; }): Promise<Metadata | undefined> => {
	if (process.env.VERCEL_ENV !== "production") return;
	const { slug } = await params;
	const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

	if (!apiUrl) return { title: 'Project Not Found' };
	const response = await fetchProjectBySlug(slug);
	if (!response.data) {
		if (response.error) return { title: 'Error Loading Project' };
		return { title: "Project Not Found" };
	} else if (response.data.length === 0) {
		return { title: "Project Not Found" };
	}
	const keywords: string[] = [];
	keywords.push(response.data[0].page_metadata.creator);
	for (const tech of response.data[0].technologies) {
		keywords.push(tech.name);
	}
	const metadata: Metadata = {
		...response.data[0].page_metadata,
		keywords,
		openGraph: {
			title: response.data[0].page_metadata.title,
			description: response.data[0].page_metadata.description,
			url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${slug}`,
			siteName: response.data[0].page_metadata.applicationName,
			type: "website",
			images: [
				{
					url: `${apiUrl}${response.data[0].image?.url}`,
					alt: response.data[0].image?.alternativeText || response.data[0].title,
				},
			],
		},
		twitter: {
			title: response.data[0].page_metadata.title,
			description: response.data[0].page_metadata.description,
			card: "summary_large_image",
			images: [
				{
					url: `${apiUrl}${response.data[0].image?.url}`,
					alt: response.data[0].image?.alternativeText || response.data[0].title,
				},
			],
		},
	};
	return metadata;
};

/**
 * Fetches all projects and returns the values of what goes in the url so nextjs can SSG it
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @returns The slugs (url parameters) for the projects
 */
export async function generateStaticParams() {
	const projects = await fetchProjectsForBuildTimeGeneration();
	return projects.map((proj) => {
		return {
			slug: proj.slug
		};
	});
};

// const Carousel = dynamic(() => import("@/components/Carousel"), {
// 	ssr: false, // This ensures the component is only rendered on the client
// });

async function ProjectPage({ params }: { params: Params; }) {
	const { slug } = await params;
	const response = await fetchProjectBySlug(slug);

	if (!response.data) {
		if (response.error) {
			console.error(response.error);
			return <p>Error getting project: {JSON.stringify(response.error)}</p>;
		}
		return <p>Project not found</p>;
	}
	const project = response.data[0];

	const jsonLd: JsonLd<CreativeWork> = {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		"@id": `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}#project`,
		"url": project.projectUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`
	};
	return (
		<>
			{process.env.VERCEL_ENV === "production" && (
				<Head>
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
					/>
					<link
						rel="canonical"
						href={`${process.env.NEXT_PUBLIC_SITE_URL}/projects/${slug}`}
					/>
				</Head>
			)}
			<div>
				<div className={styles.titleContainer}>
					{project.projectUrl ? (
						<a href={project.projectUrl} className={styles.projectUrl} target="_blank">
							<h1 className={styles.projectTitle}>{project.title}</h1>
							<Image height={24} width={24} src={"/newTab.svg"} alt={`Link to ${project.title}`} />
						</a>
					) : (
						<h1>{project.title}</h1>
					)}
					{project.githubUrl && (
						<a href={project.githubUrl} className={styles.githubLogo} target="_blank" rel="nofollow">
							<Image
								width={49}
								height={48}
								alt="Github Repository"
								src={"/github.svg"}
							/>
						</a>
					)}
				</div>
				{project.gallery && project.gallery?.length > 0 && (
					<div>
						<Carousel gallery={project.gallery || []} />
					</div>
				)}
				<div>
					<h2>Technologies Used</h2>
					<div className={styles.technologyUsedIconContainer}>
						{project.technologies.map((tech) => (
							<div key={tech.id} className={styles.technologyContainer}>
								<div>
									<Image
										src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${tech.logo?.url}`}
										width={96}
										height={96}
										alt={tech.logo?.alternativeText || ""}
										className={styles.technologyImage}
									/>
								</div>
								<span>{tech.name}</span>
							</div>
						))}
					</div>
				</div>
				<RichTextRenderer nodes={project.description} />
			</div>
		</>
	);
};

export default ProjectPage;