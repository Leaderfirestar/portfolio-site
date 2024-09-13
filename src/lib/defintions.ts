interface StrapiEntityAttributes {
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
}

interface StrapiEntity<T> {
	id: number;
	attributes: T & StrapiEntityAttributes;
}

interface MediaAttributes {
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
		small: {
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

type Media = StrapiEntity<MediaAttributes>;

export interface RichTextNode {
	type: string;
	children?: RichTextNode[];
	level?: number;
	format?: string;
	text?: string;
	bold?: boolean;
	italic?: boolean;
}

interface ProjectAttributes {
	title: string;
	description: RichTextNode[];
	shortDescription: string;
	slug: string;
	image: {
		data: Media | null;
	};
	gallery: {
		data: Media[];
	};
	technologies: {
		data: Technology[];
	};
	projectUrl: string;
	githubUrl: string;
	sortIndex: number;
}

export type Project = StrapiEntity<ProjectAttributes>;

interface TechnologyAttributes {
	name: string;
	logo?: {
		data: Media | null;
	};
}

export type Technology = StrapiEntity<TechnologyAttributes>;

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

export interface PersonalInfoAttributes {
	address: string;
	bio: RichTextNode[];
	city: string;
	email: string;
	firstName: string;
	github: string;
	jobTitle: string;
	lastName: string;
	linkedin: string;
	phoneNumber: string;
	profile: {
		data: Media;
	};
	quotes: {
		data: Quote[];
	};
	state: string;
	zip: string;
}

export type PersonalInfo = StrapiEntity<PersonalInfoAttributes>;

interface ProjectPageAttributes {
	name: string;
	description: string;
}

export type ProjectPage = StrapiEntity<ProjectPageAttributes>;

interface QuoteAttributes {
	/**
	 * Who said the quote
	 */
	author: string;
	/**
	 * The actual quote text
	 */
	value: string;
}

export type Quote = StrapiEntity<QuoteAttributes>;

interface CollegeAttributes {
	gpa: string;
	name: string;
	degrees: {
		data: Degree[];
	};
}

export type College = StrapiEntity<CollegeAttributes>;

interface DegreeAttributes {
	date: string;
	field: string;
	title: string;
}

type Degree = StrapiEntity<DegreeAttributes>;