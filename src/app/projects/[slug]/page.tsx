import RichTextRenderer from '@/components/RichTextRenderer';
import { fetchProjectBySlug } from '@/lib/projects';
import { Metadata } from 'next';
import Image from 'next/image';

interface ProjectPageProps {
	params: { slug: string; };
}

export const generateMetadata = async ({ params }: ProjectPageProps): Promise<Metadata> => {
	const { slug } = params;
	const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

	if (!apiUrl) return { title: 'Project Not Found' };

	try {
		const project = await fetchProjectBySlug(slug);
		return {
			title: project ? project.attributes.title : 'Project Not Found',
		};
	} catch {
		return { title: 'Error Loading Project' };
	}
};

async function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = params;
	const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

	if (!apiUrl) {
		return <p>API URL is not defined</p>;
	}

	try {
		const project = await fetchProjectBySlug(slug);

		if (!project) {
			return <p>Project not found</p>;
		}

		return (
			<div>
				<h1>{project.attributes.title}</h1>
				{project.attributes.image?.data?.attributes.url && (
					<Image src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${project.attributes.image.data.attributes.url}`} alt={project.attributes.title} width={192} height={192} />
				)}
				<div>
					<h2>Description</h2>
					<RichTextRenderer nodes={project.attributes.description} />
				</div>
				<h2>Technologies Used</h2>
				<ul>
					{project.attributes.technologies.data.map((tech) => (
						<li key={tech.id}>{tech.name}</li>
					))}
				</ul>
				{project.attributes.gallery && project.attributes.gallery?.data?.length > 0 && (
					<div>
						<h2>Gallery</h2>
						<div className="splide">
							<div className="splide__track">
								<ul className="splide__list">
									{project.attributes.gallery.data.map((image) => (
										<li key={image.id} className="splide__slide">
											<Image src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${image.attributes.url}`} alt={""} width={192} height={192} />
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	} catch (error) {
		//Error loading project
		console.error(error);
		return <p>{JSON.stringify(error)}</p>;
	}
};

export default ProjectPage;