"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";

export default function Nav({ top }: { top: boolean; }) {
	const pathname = usePathname();

	if (top) {
		return (
			<nav className={`${styles.nav} ${styles.topNav}`}>
				<Link href="/" className={pathname === "/" ? styles.selected : ""}>Home</Link>
				<Link href="/projects" className={pathname === "/projects" ? styles.selected : ""}>Projects</Link>
				<Link href="/resume" className={pathname === "/resume" ? styles.selected : ""}>Resume</Link>
			</nav>
		);
	}

	return (
		<nav className={`${styles.nav} ${styles.bottomNav}`}>
			<Link href="/" className={`${styles.navItem} ${pathname === "/" ? styles.selected : ""}`}>
				Home
			</Link>
			<Link href="/projects" className={`${styles.navItem} ${pathname === "/projects" ? styles.selected : ""}`}>
				Projects
			</Link>
			<Link href="/resume" className={`${styles.navItem} ${pathname === "/resume" ? styles.selected : ""}`}>
				Resume
			</Link>
		</nav>
	);
}
