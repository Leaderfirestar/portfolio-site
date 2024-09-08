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
			<div style={{ display: "flex", flexDirection: "row" }}>
				<div style={{ display: "flex", flexDirection: "column", width: "50%", height: "400px" }}>
					<h1>{homepageData.attributes.name} | {homepageData.attributes.jobTitle}</h1>
					<RichTextRenderer nodes={homepageData.attributes.bio} />
					<ul style={{ display: "flex", flexDirection: "row", padding: "0px", justifyContent: "space-between", marginTop: "auto", marginBottom: "auto" }}>
						{homepageData.attributes.quotes.data.map((quote) => <li key={quote.id} style={{ listStyleType: "none", maxWidth: "45%" }}>{quote.attributes.value}</li>)}
					</ul>
				</div>
				<div style={{ display: "flex", flexDirection: "column", width: "50%", height: "400px" }}>
					<Image
						src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${homepageData.attributes.profile.data.attributes.url}`}
						alt={homepageData.attributes.profile.data.attributes.alternativeText}
						width={300}
						height={400}
						style={{ alignSelf: "flex-end" }}
						priority
					/>
				</div>
			</div>
		</main>
	);
}
