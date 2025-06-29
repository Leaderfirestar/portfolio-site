import ResumeSubSection from "@/components/ResumeSubSection";
import { College, Employer, JsonLd, Project, TechCategory, Technology } from "@/lib/defintions";
import { fetchPersonalInfo } from "@/lib/personalInfo";
import { fetchResume } from "@/lib/resume";
import styles from "./page.module.css";
import { Metadata } from "next";
import DownloadButton from "@/components/DownloadButton";
import Link from "next/link";
import Head from "next/head";
import { Person } from "schema-dts";

export async function generateMetadata(): Promise<Metadata | undefined> {
	if (process.env.VERCEL_ENV !== "production") return;
	const resume = await fetchResume();
	const metadata: Metadata = {
		...resume.page_metadata,
		openGraph: {
			title: resume.page_metadata.title,
			description: resume.page_metadata.description,
			url: `${process.env.NEXT_PUBLIC_SITE_URL}/resume`,
			siteName: resume.page_metadata.applicationName,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: resume.page_metadata.title,
			description: resume.page_metadata.description,
			// If I ever make a twitter, I can uncomment these and assosciate my personal twitter with creator and site. site could also be my website's twitter.
			// site: "",
			// creator: ""
		},
	};
	return metadata;
}

async function Resume() {
	const [personalInfo, resume] = await Promise.all([fetchPersonalInfo(), fetchResume()]);
	const fullAddress = `${personalInfo.address}, ${personalInfo.city}, ${personalInfo.state}, ${personalInfo.zip}`;
	const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.toUpperCase();
	const collegeChildren = assembleCollegeChildren(resume.colleges);
	const skillChild = assembleSkillChild(resume.techcategories);
	const workChildren = assembleWorkExperience(resume.employers);
	const projectChildren = assembleProjectStuff(resume.projects);
	const jsonLd: JsonLd<Person> = {
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#author`,
	};
	return (
		<>
			<Head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
				/>
			</Head>
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
						<ResumeSubSection header="Skills">
							{skillChild}
						</ResumeSubSection>
						<ResumeSubSection header="Work Experience">
							{workChildren}
						</ResumeSubSection>
						<ResumeSubSection header="Education">
							{collegeChildren}
						</ResumeSubSection>
						<ResumeSubSection header="Projects">
							{projectChildren}
						</ResumeSubSection>
					</div>
				</div>
			</div>
		</>
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
 * @param techcategories The technologies I want listed on my resume
 * @returns The skills listed out
 */
function assembleSkillChild(techcategories: TechCategory[]): JSX.Element {
	const final: Record<string, string> = {};
	for (let i = 0; i < techcategories.length; i++) {
		const techcategory = techcategories[i];
		for (let j = 0; j < techcategory.technologies.length; j++) {
			const technology = techcategory.technologies[j];
			if (!final[techcategory.name]) {
				final[techcategory.name] = technology.name;
			} else {
				final[techcategory.name] += `, ${technology.name}`;
			}
		}
	}
	return (
		<div>
			{Object.keys(final).map((category) => {
				return (
					<p key={`TechCategory-${category}`} className={styles.subsectionP}>
						<span className={styles.boldSpan}>{category}:</span> {final[category]}
					</p>
				);
			})}
		</div>
	);
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