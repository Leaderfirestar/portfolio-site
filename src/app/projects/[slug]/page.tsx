import styles from "./page.module.css";
import RichTextRenderer from '@/components/RichTextRenderer';
import { fetchProjectBySlug } from '@/lib/projects';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';

interface ProjectPageProps {
	params: { slug: string; };
}

export const generateMetadata = async ({ params }: ProjectPageProps): Promise<Metadata> => {
	const { slug } = params;
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
	keywords.push(response.data[0].attributes.page_metadatum.data.attributes.creator);
	for (const tech of response.data[0].attributes.technologies.data) {
		keywords.push(tech.attributes.name);
	}
	const metadata: Metadata = {
		...response.data[0].attributes.page_metadatum.data.attributes,
		keywords
	};
	return metadata;
};

const EmblaCarouselComponent = dynamic(() => import("@/components/EmblaCarouselComponent"), {
	ssr: false, // This ensures the component is only rendered on the client
});

async function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = params;
	const response = await fetchProjectBySlug(slug);

	if (!response.data) {
		if (response.error) {
			console.error(response.error);
			return <p>Error getting project: {JSON.stringify(response.error)}</p>;
		}
		return <p>Project not found</p>;
	}
	const project = response.data[0];
	return (
		<div>
			<div className={styles.titleContainer}>
				{project.attributes.projectUrl ? (
					<a href={project.attributes.projectUrl} className={styles.projectUrl} target="_blank">
						<h1 className={styles.projectTitle}>{project.attributes.title}</h1>
						<Image height={24} width={24} src={"/newTab.svg"} alt={`Link to ${project.attributes.title}`} />
					</a>
				) : (
					<h1>{project.attributes.title}</h1>
				)}
				{project.attributes.githubUrl && (
					<a href={project.attributes.githubUrl} className={styles.githubLogo} target="_blank" rel="nofollow">
						<Image
							width={49}
							height={48}
							alt="Github Repository"
							src={"/github.svg"}
						/>
					</a>
				)}
			</div>
			{project.attributes.gallery && project.attributes.gallery?.data?.length > 0 && (
				<div>
					<EmblaCarouselComponent slides={project.attributes.gallery.data.map(image => ({
						id: image.id,
						url: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${image.attributes.url}`,
						alt: image.attributes.alternativeText || ''
					})) || []}
					/>
				</div>
			)}
			<div>
				<h2>Technologies Used</h2>
				<div className={styles.technologyUsedIconContainer}>
					{project.attributes.technologies.data.map((tech) => (
						<div key={tech.id} className={styles.technologyContainer}>
							<div>
								<Image
									src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${tech.attributes.logo?.data?.attributes.url}`}
									width={96}
									height={96}
									alt={tech.attributes.logo?.data?.attributes.alternativeText || ""}
									className={styles.technologyImage}
								/>
							</div>
							<span>{tech.attributes.name}</span>
						</div>
					))}
				</div>
			</div>
			<RichTextRenderer nodes={project.attributes.description} />
		</div>
	);
};

export default ProjectPage;