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
	}
	return {
		title: response.data[0] ? response.data[0].attributes.title : 'Project Not Found',
	};
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
			<h1>{project.attributes.title}</h1>
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
				<div style={{ display: "flex", flexDirection: "row", overflowX: "auto", columnGap: "5px" }}>
					{project.attributes.technologies.data.map((tech) => (
						<div key={tech.id} style={{ display: "flex", flexDirection: "column" }}>
							<div>
								<Image
									src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${tech.attributes.logo?.data?.attributes.url}`}
									width={96}
									height={96}
									alt={tech.attributes.logo?.data?.attributes.alternativeText || ""}
									style={{ backgroundColor: "#FFF" }}
								/>
							</div>
							<span style={{ textAlign: "center" }}>{tech.attributes.name}</span>
						</div>
					))}
				</div>
			</div>
			<RichTextRenderer nodes={project.attributes.description} />
		</div>
	);
};

export default ProjectPage;