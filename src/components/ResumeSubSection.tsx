import styles from "./ResumeSubSection.module.css";

interface Props {
	children: JSX.Element[];
	header: string;
}

function ResumeSubSection(props: Props) {
	const { children, header } = props;

	return (
		<div className={styles.container}>
			<h2 className={styles.header}>{header}</h2>
			<div className={styles.content}>
				{children}
			</div>
		</div>
	);
}

export default ResumeSubSection;