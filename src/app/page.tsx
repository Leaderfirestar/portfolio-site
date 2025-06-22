import styles from "./page.module.css";
import RichTextRenderer from "@/components/RichTextRenderer";
import { fetchPersonalInfo } from "@/lib/personalInfo";
import { Metadata } from "next";
import Image from "next/image";
import Head from "next/head";
import { JsonLd } from "@/lib/defintions";
import { Person } from "schema-dts";
import { fetchCollegeInfo } from "@/lib/college";

export async function generateMetadata(): Promise<Metadata | undefined> {
    if (process.env.VERCEL_ENV !== "production") return;
    const personalInfo = await fetchPersonalInfo();
    const metadata: Metadata = {
        ...personalInfo.page_metadata,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_SITE_URL}`,
        },
        openGraph: {
            title: personalInfo.page_metadata.title,
            description: personalInfo.page_metadata.description,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
            siteName: personalInfo.page_metadata.applicationName,
            type: "website",
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${personalInfo.profile?.url}`,
                    alt: personalInfo.profile?.alternativeText || `${personalInfo.firstName} ${personalInfo.lastName}`,
                },
            ],
        },
        twitter: {
            title: personalInfo.page_metadata.title,
            description: personalInfo.page_metadata.description,
            card: "summary_large_image",
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${personalInfo.profile?.url}`,
                    alt: personalInfo.profile?.alternativeText || `${personalInfo.firstName} ${personalInfo.lastName}`,
                },
            ],
        }
    };
    return metadata;
}

export default async function Home() {
    const [personalInfo, colleges] = await Promise.all([fetchPersonalInfo(), fetchCollegeInfo()]);
    const jsonLd: JsonLd<Person> = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#author`,
        name: `${personalInfo.firstName} ${personalInfo.lastName}`,
        jobTitle: personalInfo.jobTitle,
        url: process.env.NEXT_PUBLIC_SITE_URL,
        image: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${personalInfo.profile?.url}`,
        sameAs: [
            personalInfo.github,
            personalInfo.linkedin,
        ],
        description: personalInfo.page_metadata.description,
        alumniOf: colleges.map(college => ({
            "@type": "CollegeOrUniversity",
            name: college.name,
        })),
        worksFor: {
            "@type": "Organization",
            name: "FactorEarth"
        }
    };
    return (
        <>
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
                />
            </Head>
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
        </>
    );
}