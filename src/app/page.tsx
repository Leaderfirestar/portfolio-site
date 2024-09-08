import styles from "./page.module.css";
import RichTextRenderer from "@/components/RichTextRenderer";
import { fetchHomepageData } from "@/lib/homepage";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
	const homepageData = await fetchHomepageData();
	const metadata: Metadata = {
		title: homepageData.attributes.name || 'Home',
	};
	return metadata;
}

export default async function Home() {
	const homepageData = await fetchHomepageData();
	return (
		<main>
			<div className={styles.container}>
				<div className={styles.textContainer}>
					<h1>{homepageData.attributes.name} | {homepageData.attributes.jobTitle}</h1>
					<RichTextRenderer nodes={homepageData.attributes.bio} />
					<ul className={styles.quoteList}>
						{homepageData.attributes.quotes.data.map((quote) => <li key={quote.id} className={styles.quoteListItem}>{quote.attributes.value}</li>)}
					</ul>
				</div>
				<div className={styles.profileContainer}>
					<Image
						src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${homepageData.attributes.profile.data.attributes.url}`}
						alt={homepageData.attributes.profile.data.attributes.alternativeText}
						width={300}
						height={400}
						className={styles.profile}
						priority
					/>
				</div>
			</div>
		</main>
	);
}
