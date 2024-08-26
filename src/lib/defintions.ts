interface Media {
	id: number;
	attributes: {
		url: string;
		formats?: {
			thumbnail?: {
				url: string;
			};
		};
	};
}

export interface RichTextNode {
	type: string;
	children?: RichTextNode[];
	level?: number;
	format?: string;
	text?: string;
}

export interface Project {
	id: number;
	title: string;
	description: RichTextNode[];
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
}

export interface Technology {
	id: number;
	name: string;
	logo?: {
		data: Media | null;
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
	data: SingularThing<T>[];
	meta: StrapiFindMeta;
}

interface StrapiFindThingError {
	data: null;
	error: StrapiFindErrorInterface;
}

export interface SingularThing<T> {
	id: number;
	attributes: T;
}

export type StrapiSingleThingResponse<T> = StrapiFindThing<T> | StrapiFindThingError;