import { fetchPersonalInfo } from "@/lib/personalInfo";
import "@/styles/global.css";
import { Metadata } from "next";
import Image from "next/image";
import Nav from "./Nav";
import styles from "./page.module.css";

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_CANONICAL_URL!),
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	const personalInfo = await fetchPersonalInfo();

	return (
		<html lang="en">
			<body className={styles.pageContainer}>

				{/* Top Nav (desktop) */}
				<Nav top={true} />

				{children}

				{/* Footer */}
				<footer className={styles.contactInfoContainer}>
					<p className={styles.contactParagraph}>{personalInfo.firstName} {personalInfo.lastName}</p>
					<p className={styles.contactParagraph}><a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></p>

					<div className={styles.iconContainer}>
						<a href={personalInfo.github} target="_blank" rel="nofollow">
							<Image width={49} height={48} src="/github.svg" alt={`${personalInfo.firstName} ${personalInfo.lastName}'s gitHub`} />
						</a>
						<a href={personalInfo.linkedin} target="_blank" rel="nofollow">
							<Image width={49} height={49} src="/linkedin.webp" alt={`${personalInfo.firstName} ${personalInfo.lastName}'s linkedIn`} />
						</a>
					</div>
				</footer>

				{/* Bottom Nav (mobile, fixed) */}
				<Nav top={false} />
			</body>
		</html>
	);
} 