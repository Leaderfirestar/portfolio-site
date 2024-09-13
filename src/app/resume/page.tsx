import { fetchPersonalInfo } from "@/lib/personalInfo";
import styles from "./page.module.css";
import ResumeSubSection from "@/components/ResumeSubSection";
import { fetchCollegeInfo } from "@/lib/college";
import { College } from "@/lib/defintions";

async function Resume() {
	const [personalInfo, colleges] = await Promise.all([fetchPersonalInfo(), fetchCollegeInfo()]);
	const collegeChildren = assembleCollegeChildren(colleges);
	const fullAddress = `${personalInfo.attributes.address}, ${personalInfo.attributes.city}, ${personalInfo.attributes.state}, ${personalInfo.attributes.zip}`;
	const fullName = `${personalInfo.attributes.firstName} ${personalInfo.attributes.lastName}`.toUpperCase();
	const fullContactInfo = `${personalInfo.attributes.phoneNumber} \u2022 ${fullAddress} \u2022 ${personalInfo.attributes.email} \u2022 ${personalInfo.attributes.github}`;
	// name
	// phone/email/address/github/linkedin
	// Education
	// Employers/accomplishments
	// projects
	return (
		<div className={styles.container}>
			<div className={styles.pageContent}>
				<div className={styles.header}>
					<h1 className={styles.name}>{fullName}</h1>
					<p className={styles.contactInfo}>{fullContactInfo}</p>
				</div>
				<div className={styles.contentContainer}>
					<ResumeSubSection header="Education">
						{collegeChildren}
					</ResumeSubSection>
					<ResumeSubSection header="Skills" />
					<ResumeSubSection header="Work Experience" />
					<ResumeSubSection header="Projects" />
				</div>
			</div>
		</div>
	);
}

function assembleCollegeChildren(colleges: College[]): JSX.Element[] {
	const children: JSX.Element[] = colleges.map((college) => {
		const degreeChildren: JSX.Element[] = college.attributes.degrees.data.map((degree) => {
			// title + field
			// date
			const [year, month, day] = degree.attributes.date.split("-");
			const date = new Date();
			date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day));
			const dateString = date.toLocaleString("default", { month: "long", day: "numeric", year: "numeric" });
			return (
				<div key={degree.attributes.title} className={styles.degreeContainer}>
					<div className={styles.degreeHeader}>
						<p className={styles.degreeName}>{degree.attributes.title}</p>
						<p className={styles.degreeField}>{degree.attributes.field}</p>
					</div>
					<div>
						<p className={styles.subsectionP}>{dateString}</p>
					</div>
				</div>
			);
		});
		return (
			<div key={college.id} className={styles.subsectionChildrenContainer}>
				<div className={styles.subsectionMetaContainer}>
					<p className={styles.subsectionP}>{college.attributes.name}</p>
					<p className={styles.subsectionP}>GPA: {college.attributes.gpa}</p>
				</div>
				{degreeChildren}
			</div>
		);
	});
	return children;
}

export default Resume;