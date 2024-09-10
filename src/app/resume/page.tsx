import styles from "./page.module.css";

async function Resume() {
	return (
		<div className={styles.container}>
			<div className={styles.sidebar}></div>
			<div className={styles.content}></div>
		</div>
	);
}

export default Resume;