import styles from "./page.module.css";
import RichTextRenderer from "@/components/RichTextRenderer";
import { fetchPersonalInfo } from "@/lib/personalInfo";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
	const personalInfo = await fetchPersonalInfo();
	const metadata: Metadata = personalInfo.page_metadata;
	return metadata;
}

export default async function Home() {
	const personalInfo = await fetchPersonalInfo();
	return (
		<main>
			<div className={styles.container}>
				<div className={styles.textContainer}>
					<h1>{personalInfo.firstName} {personalInfo.lastName} | {personalInfo.jobTitle}</h1>
					<RichTextRenderer nodes={personalInfo.bio} />
					<ul className={styles.quoteList}>
						{personalInfo.quotes.map((quote) => <li key={quote.id} className={styles.quoteListItem}>{quote.value}</li>)}
					</ul>
				</div>
				{personalInfo.profile?.url && (
					<div className={styles.profileContainer}>
						<Image
							src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${personalInfo.profile.url}`}
							alt={personalInfo.profile.alternativeText}
							width={450}
							height={300}
							className={styles.profile}
							priority
						/>
					</div>
				)}
			</div>
		</main>
	);
}
