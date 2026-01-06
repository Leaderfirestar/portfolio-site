import Carousel from '@/components/Carousel';
import RichTextRenderer from '@/components/RichTextRenderer';
import { JsonLd } from '@/lib/defintions';
import { fetchProjectBySlug, fetchProjectsForBuildTimeGeneration } from '@/lib/projects';
import { Metadata } from 'next';
import Image from 'next/image';
import { CreativeWork } from 'schema-dts';
import styles from "./page.module.css";

export const generateMetadata = async ({ params }: PageProps<`/projects/[slug]`>): Promise<Metadata | undefined> => {
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
	const metadata: Metadata = {
		...response.data[0].page_metadata,
		metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL}`),
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
		}
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

async function ProjectPage({ params }: PageProps<`/projects/[slug]`>) {
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
		"@id": `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${response.data[0].slug}#project`,
		"url": response.data[0].projectUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${response.data[0].slug}`
	};

	return (
		<div className={styles.container}>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
			/>
			<div className={styles.header}>
				<div className={styles.titleRow}>
					{project.projectUrl ? (
						<a href={project.projectUrl} target="_blank" className={styles.projectLink}>
							<h1>{project.title}</h1>
							<Image src="/newTab.svg" width={20} height={20} alt="" />
						</a>
					) : (
						<h1>{project.title}</h1>
					)}
				</div>
				{project.githubUrl && (
					<a href={project.githubUrl} target="_blank" className={styles.githubLink}>
						<Image src="/github.svg" width={32} height={32} alt="GitHub" />
					</a>
				)}
			</div>
			{project.gallery?.length > 0 && (
				<div className={styles.mediaSection}>
					<Carousel gallery={project.gallery || []} />
				</div>
			)}
			<section className={`${styles.techSection} ${styles.content}`}>
				<h2>Technologies Used</h2>
				<div className={styles.techGrid}>
					{project.technologies.map((tech) => (
						<div key={tech.id} className={styles.techCard}>
							<Image
								src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${tech.logo?.url}`}
								width={64}
								height={64}
								alt={tech.name}
							/>
							<span>{tech.name}</span>
						</div>
					))}
				</div>
			</section>
			<section className={`${styles.description} ${styles.content}`}>
				<RichTextRenderer nodes={project.description} />
			</section>
		</div>
	);
};

export default ProjectPage;