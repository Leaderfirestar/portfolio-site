import { fetchPersonalInfo } from "@/lib/personalInfo";
import "@/styles/global.css";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	const personalInfo = await fetchPersonalInfo();
	return (
		<html lang="en">
			<body className={styles.pageContainer}>
				<nav className={styles.nav}>
					<div>
						<Link href="/">Home</Link>
					</div>
					<div>
						<Link href="/projects">Projects</Link>
					</div>
					<div>
						<Link href="/resume">Resume</Link>
					</div>
				</nav>
				{children}
				<footer className={styles.contactInfoContainer}>
					<p className={styles.contactParagraph}>{personalInfo.attributes.firstName} {personalInfo.attributes.lastName}</p>
					<p className={styles.contactParagraph}><a href={`mailto:${personalInfo.attributes.email}`}>{personalInfo.attributes.email}</a></p>
					<div className={styles.iconContainer}>
						<a href={personalInfo.attributes.github} target="_blank" rel="nofollow"><Image width={49} height={48} src={"/github.svg"} alt={`Github repository for ${personalInfo.attributes.firstName} ${personalInfo.attributes.lastName}`} /></a>
					</div>
				</footer>
			</body>
		</html>
	);
}
