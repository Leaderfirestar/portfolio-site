import ResumeSubSection from "@/components/ResumeSubSection";
import { College, Employer, Project, Technology } from "@/lib/defintions";
import { fetchPersonalInfo } from "@/lib/personalInfo";
import { fetchResume } from "@/lib/resume";
import styles from "./page.module.css";

async function Resume() {
	const [personalInfo, resume] = await Promise.all([fetchPersonalInfo(), fetchResume()]);
	const fullAddress = `${personalInfo.attributes.address}, ${personalInfo.attributes.city}, ${personalInfo.attributes.state}, ${personalInfo.attributes.zip}`;
	const fullName = `${personalInfo.attributes.firstName} ${personalInfo.attributes.lastName}`.toUpperCase();
	const fullContactInfo = `${personalInfo.attributes.phoneNumber} \u2022 ${fullAddress}`;
	const collegeChildren = assembleCollegeChildren(resume.attributes.colleges.data);
	const skillChild = assembleSkillChild(resume.attributes.technologies.data);
	const workChildren = assembleWorkExperience(resume.attributes.employers.data);
	const projectChildren = assembleProjectStuff(resume.attributes.projects.data);
	return (
		<div className={styles.container}>
			<div className={styles.pageContent}>
				<div className={styles.header}>
					<h1 className={styles.name}>{fullName}</h1>
					<p className={styles.contactInfo}>{fullContactInfo} &#8226; <a href={`mailto:${personalInfo.attributes.email}`}>{personalInfo.attributes.email}</a> &#8226; <a href={personalInfo.attributes.github}>{personalInfo.attributes.github}</a></p>
				</div>
				<div className={styles.contentContainer}>
					<ResumeSubSection header="Education">
						{collegeChildren}
					</ResumeSubSection>
					<ResumeSubSection header="Skills">
						{skillChild}
					</ResumeSubSection>
					<ResumeSubSection header="Work Experience">
						{workChildren}
					</ResumeSubSection>
					<ResumeSubSection header="Projects">
						{projectChildren}
					</ResumeSubSection>
				</div>
			</div>
		</div>
	);
}

/**
 * Given the colleges, creates an array of elements to be used with the ResumeSubSection component
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @param colleges The colleges I want listed on the resume
 * @returns An array of elements filled with content and styled
 */
function assembleCollegeChildren(colleges: College[]): JSX.Element[] {
	const children: JSX.Element[] = colleges.map((college) => {
		const degreeChildren: JSX.Element[] = college.attributes.degrees.data.map((degree) => {
			const options: Intl.DateTimeFormatOptions = {
				month: "short",
				day: "numeric",
				year: "numeric"
			};
			const dateString = assembleDate(degree.attributes.date, options);
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

/**
 * Given the technologies, creates a paragraph listing those skills
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @param technologies The technologies I want listed on my resume
 * @returns The skills listed out
 */
function assembleSkillChild(technologies: Technology[]): JSX.Element[] {
	let final = "";
	for (let i = 0; i < technologies.length; i++) {
		final += i === technologies.length - 1 ? technologies[i].attributes.name : `${technologies[i].attributes.name}, `;
	}
	return [<p key="skill list" className={styles.subsectionP}>{final}</p>];
}

/**
 * Given the employers, creates an array of elements to be used with the ResumeSubsection component
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @param employers The employers I want listed on my resume
 * @returns An array of contentful, styled jsx elements
 */
function assembleWorkExperience(employers: Employer[]): JSX.Element[] {
	const final = [];
	for (const employer of employers) {
		const options: Intl.DateTimeFormatOptions = {
			day: "numeric",
			month: "short",
			year: "numeric"
		};
		const startDate = assembleDate(employer.attributes.startDate, options);
		const endDate = assembleDate(employer.attributes.endDate, options);
		const accomplishmentList: JSX.Element[] = employer.attributes.accomplishments.data.map((accomplishment) => {
			return <li key={`Accomplishment - ${accomplishment.id}`}>{accomplishment.attributes.value}</li>;
		});
		final.push(
			<div key={`Employer - ${employer.id}`} className={styles.subsectionChildrenContainer}>
				<div className={styles.subsectionMetaContainer}>
					<p className={styles.subsectionP}>{employer.attributes.name}, {employer.attributes.location}</p>
					<p className={styles.subsectionP}>{startDate} - {endDate || "Present"}</p>
				</div>
				<div className={styles.subsectionMetaContainer}>
					<p className={styles.subsectionPBold}>{employer.attributes.jobTitle}</p>
				</div>
				<ul>
					{accomplishmentList}
				</ul>
			</div>
		);
	}
	return final;
}

/**
 * Given the projects, creates an array of elements to use with the ResumeSubsection component
 * @author Eric Webb <ericawebb2000@yaoo.com>
 * @param projects The projects I want listed on my resume
 * @returns An array of styled, contentful elements
 */
function assembleProjectStuff(projects: Project[]): JSX.Element[] {
	const finalProjects = projects.map((project) => {
		const options: Intl.DateTimeFormatOptions = {
			month: "short",
			year: "numeric"
		};
		const startDate = assembleDate(project.attributes.startDate, options);
		const endDate = assembleDate(project.attributes.endDate, options);
		let dateString = "";
		if (startDate && endDate) {
			dateString = `${startDate} - ${endDate}`;
		} else if (startDate) {
			// only has start date
			dateString = `${startDate} - Present`;
		} else {
			// Only has end date
			dateString = endDate;
		}
		return (
			<div key={`Project-${project.id}`}>
				<div className={styles.degreeContainer}>
					<p className={styles.subsectionP}>
						<span className={styles.boldSpan}>
							{project.attributes.title},&nbsp;
						</span>
						<span>
							{project.attributes.slogan}
						</span>
					</p>
					<p className={styles.subsectionP}>
						{dateString}
					</p>
				</div>
				<ul>
					<li key={`Project-${project.id}-description`}>{project.attributes.resumeDescription}</li>
				</ul>
			</div>
		);
	});
	return [
		<div key={`ResumeProjects`} className={styles.projectContainer}>
			{finalProjects}
		</div>
	];
}

/**
 * Given a date, formats it as described in the options
 * @author Eric Webb <ericawebb2000@yahoo.com>
 * @param date A date string, formatted YYYY-MM-DD
 * @param options The options for how we want to see the date formatted
 * @returns The formatted date string, provided it could be formatted
 */
function assembleDate(date: string, options: Intl.DateTimeFormatOptions): string {
	if (!date) return date;
	const dateComponents = date.split("-");
	if (dateComponents.length !== 3) return date;
	const newDate = new Date();
	newDate.setFullYear(parseInt(dateComponents[0]), parseInt(dateComponents[1]) - 1, parseInt(dateComponents[2]));
	const dateString = newDate.toLocaleString("default", options);
	return dateString;
}

export default Resume;