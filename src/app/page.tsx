import styles from "./page.module.css";
import RichTextRenderer from "@/components/RichTextRenderer";
import { fetchPersonalInfo } from "@/lib/personalInfo";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
	const personalInfo = await fetchPersonalInfo();
	const metadata: Metadata = personalInfo.attributes.page_metadatum.data.attributes;
	return metadata;
}

export default async function Home() {
	const personalInfo = await fetchPersonalInfo();
	return (
		<main>
			<div className={styles.container}>
				<div className={styles.textContainer}>
					<h1>{personalInfo.attributes.firstName} {personalInfo.attributes.lastName} | {personalInfo.attributes.jobTitle}</h1>
					<RichTextRenderer nodes={personalInfo.attributes.bio} />
					<ul className={styles.quoteList}>
						{personalInfo.attributes.quotes.data.map((quote) => <li key={quote.id} className={styles.quoteListItem}>{quote.attributes.value}</li>)}
					</ul>
				</div>
				<div className={styles.profileContainer}>
					<Image
						src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${personalInfo.attributes.profile.data.attributes.url}`}
						alt={personalInfo.attributes.profile.data.attributes.alternativeText}
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
