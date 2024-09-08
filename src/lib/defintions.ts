interface Media {
	id: number;
	attributes: {
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
		createdAt: string,
		updatedAt: string;
	};
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

export interface Project {
	id: number;
	attributes: {
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
		sortIndex: number;
	};
}

export interface Technology {
	id: number;
	attributes: {
		name: string;
		logo?: {
			data: Media | null;
		};
	};
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

export interface Homepage {
	id: number;
	attributes: {
		bio: RichTextNode[];
		jobTitle: string;
		name: string;
		profile: {
			data: Media;
		};
		quotes: {
			data: Quote[];
		};
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
	};
}

export interface Projectpage {
	id: number;
	attributes: {
		name: string;
		description: string;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
	};
}

interface Quote {
	id: number;
	attributes: {
		/**
		 * Who said the quote
		 */
		author: string;
		/**
		 * The actual quote text
		 */
		value: string;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
	};
}