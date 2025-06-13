import { ReferrerEnum } from "next/dist/lib/metadata/types/metadata-types";

interface StrapiEntity {
	id: number;
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
}

export interface Media extends StrapiEntity {
	name: string,
	alternativeText: string,
	caption: string | null,
	width: number,
	height: number,
	formats?: {
		thumbnail: {
			name: string;
			hash: string;
			ext: string;
			mime: string;
			path: string | null,
			width: number,
			height: number,
			size: number,
			sizeInBytes: number,
			url: string;
		},
		small?: {
			name: string;
			hash: string;
			ext: string;
			mime: string;
			path: null,
			width: number,
			height: number,
			size: number,
			sizeInBytes: number,
			url: string;
		};
	};
	hash: string,
	ext: string,
	mime: string,
	size: number,
	url: string,
	previewUrl: string | null,
	provider: string,
	provider_metadata: null,
}

export interface RichTextNode {
	type: string;
	children?: RichTextNode[];
	level?: number;
	format?: string;
	text?: string;
	bold?: boolean;
	italic?: boolean;
}

export interface Project extends StrapiEntity {
	description: RichTextNode[];
	endDate: string;
	gallery: Media[];
	githubUrl: string;
	image: Media | null;
	page_metadata: PageMetadata;
	projectUrl: string;
	resumeDescription: string;
	shortDescription: string;
	slogan: string;
	slug: string;
	sortIndex: number;
	startDate: string;
	technologies: Technology[];
	title: string;
}

export interface Technology extends StrapiEntity {
	name: string;
	logo?: Media | null;
}

export interface TechCategory {
	name: string;
	technologies: Technology[];
}

interface StrapiFindMeta {
	page: number;
	pageSize: number;
	pageCount: number;
	total: number;
}

interface StrapiFindErrorInterface {
	status: number;
	name: string;
	message: string;
	details: {};
}

interface StrapiFindError {
	data: null;
	error: StrapiFindErrorInterface;
}

interface StrapiFindList<T> {
	data: T[];
	meta: StrapiFindMeta;
}

export type StrapiFindResponse<T> = StrapiFindList<T> | StrapiFindError;

interface StrapiFindThing<T> {
	data: T[];
	meta: StrapiFindMeta;
}

export interface StrapiFindThingError {
	data: null;
	error: StrapiFindErrorInterface;
}

export interface SingularThing<T> {
	id: number;
	attributes: T;
}

export type StrapiSingleThingResponse<T> = StrapiFindThing<T> | StrapiFindThingError;

export interface PersonalInfo extends StrapiEntity {
	address: string;
	bio: RichTextNode[];
	city: string;
	email: string;
	firstName: string;
	github: string;
	jobTitle: string;
	lastName: string;
	linkedin: string;
	page_metadata: PageMetadata;
	phoneNumber: string;
	profile: Media;
	quotes: Quote[];
	state: string;
	zip: string;
}

export interface ProjectPage extends StrapiEntity {
	name: string;
	description: string;
	page_metadata: PageMetadata;
}

interface Quote extends StrapiEntity {
	/**
	 * Who said the quote
	 */
	author: string;
	/**
	 * The actual quote text
	 */
	value: string;
	title: string;
}

export interface College extends StrapiEntity {
	gpa: number;
	name: string;
	degrees: Degree[];
}

interface Degree extends StrapiEntity {
	date: string;
	field: string;
	title: string;
}

export interface Resume extends StrapiEntity {
	colleges: College[];
	employers: Employer[];
	page_metadata: PageMetadata;
	projects: Project[];
	resume: Media;
	techcategories: TechCategory[];
}

export interface Employer extends StrapiEntity {
	name: string;
	jobTitle: string;
	startDate: string;
	endDate: string;
	location: string;
	accomplishments: Accomplishment[];
}

interface Accomplishment extends StrapiEntity {
	title: string;
	value: string;
}

export interface PageMetadata extends StrapiEntity {
	applicationName: string;
	creator: string;
	description: string;
	keywords: string;
	publisher: string;
	referrer: ReferrerEnum;
	title: string;
};