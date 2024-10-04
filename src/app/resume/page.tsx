import ResumeSubSection from "@/components/ResumeSubSection";
import { College, Employer, Project, Technology } from "@/lib/defintions";
import { fetchPersonalInfo } from "@/lib/personalInfo";
import { fetchResume } from "@/lib/resume";
import styles from "./page.module.css";
import { Metadata } from "next";
import DownloadButton from "@/components/DownloadButton";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
	const resume = await fetchResume();
	return resume.page_metadata;
}

async function Resume() {
	const [personalInfo, resume] = await Promise.all([fetchPersonalInfo(), fetchResume()]);
	const fullAddress = `${personalInfo.address}, ${personalInfo.city}, ${personalInfo.state}, ${personalInfo.zip}`;
	const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.toUpperCase();
	const collegeChildren = assembleCollegeChildren(resume.colleges);
	const skillChild = assembleSkillChild(resume.technologies);
	const workChildren = assembleWorkExperience(resume.employers);
	const projectChildren = assembleProjectStuff(resume.projects);
	return (
		<div className={styles.container}>
			<div className={styles.pageContent}>
				<div className={styles.contentContainer}>
					<div className={styles.header}>
						<div className={styles.nameContainer}>
							<h1 className={styles.name}>{fullName}</h1>
							<DownloadButton media={resume.resume} classname={styles.downloadButton} />
						</div>
						<div className={styles.contactInfoRow}>
							<div className={styles.contactInfoColumn}>
								<div className={styles.contactInfoCell}>
									<p className={styles.contactInfoHeader}>Phone:</p>
									<p className={styles.contactInfo}>{personalInfo.phoneNumber}</p>
								</div>
								<div className={styles.contactInfoCell}>
									<p className={styles.contactInfoHeader}>Address:</p>
									<p className={styles.contactInfo}>{fullAddress}</p>
								</div>
								<div className={styles.contactInfoCell}>
									<p className={styles.contactInfoHeader}>Email:</p>
									<p className={styles.contactInfo}><a className={styles.contactInfoLink} href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></p>
								</div>
							</div>
							<div className={styles.contactInfoColumn}>
								<div className={styles.contactInfoCell}>
									<p className={styles.contactInfoHeader}>LinkedIn:</p>
									<p className={styles.contactInfo}><a className={styles.contactInfoLink} href={personalInfo.linkedin} target="_blank" rel="nofollow">{personalInfo.linkedin}</a></p>
								</div>
								<div className={styles.contactInfoCell}>
									<p className={styles.contactInfoHeader}>GitHub:</p>
									<p className={styles.contactInfo}><a className={styles.contactInfoLink} href={personalInfo.github} target="_blank" rel="nofollow">{personalInfo.github}</a></p>
								</div>
								<div className={styles.contactInfoCell}>
									<p className={styles.contactInfoHeader}>Portfolio:</p>
									<p className={styles.contactInfo}><Link className={styles.contactInfoLink} href={"/"} target="_blank" rel="nofollow">{process.env.NEXT_PUBLIC_SITE_URL}</Link></p>
								</div>
							</div>
						</div>
					</div>
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
		const degreeChildren: JSX.Element[] = college.degrees.map((degree) => {
			const options: Intl.DateTimeFormatOptions = {
				month: "short",
				day: "numeric",
				year: "numeric"
			};
			const dateString = assembleDate(degree.date, options);
			return (
				<div key={degree.title} className={styles.degreeContainer}>
					<div className={styles.degreeHeader}>
						<p className={styles.degreeName}>{degree.title}</p>
						<p className={styles.degreeField}>{degree.field}</p>
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
					<p className={styles.subsectionP}>{college.name}</p>
					<p className={styles.subsectionP}>GPA: {college.gpa}</p>
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
		final += i === technologies.length - 1 ? technologies[i].name : `${technologies[i].name}, `;
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
		const startDate = assembleDate(employer.startDate, options);
		const endDate = assembleDate(employer.endDate, options);
		const accomplishmentList: JSX.Element[] = employer.accomplishments.map((accomplishment) => {
			return <li key={`Accomplishment - ${accomplishment.id}`}>{accomplishment.value}</li>;
		});
		final.push(
			<div key={`Employer - ${employer.id}`} className={styles.subsectionChildrenContainer}>
				<div className={styles.subsectionMetaContainer}>
					<p className={styles.subsectionP}>{employer.name}, {employer.location}</p>
					<p className={styles.subsectionP}>{startDate} - {endDate || "Present"}</p>
				</div>
				<div className={styles.subsectionMetaContainer}>
					<p className={styles.subsectionPBold}>{employer.jobTitle}</p>
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
		const startDate = assembleDate(project.startDate, options);
		const endDate = assembleDate(project.endDate, options);
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
							{project.title},&nbsp;
						</span>
						<span>
							{project.slogan}
						</span>
					</p>
					<p className={styles.subsectionP}>
						{dateString}
					</p>
				</div>
				<ul>
					<li key={`Project-${project.id}-description`}>{project.resumeDescription}</li>
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