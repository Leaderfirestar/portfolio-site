"use client";

import { Media } from "@/lib/defintions";
import Image from "next/image";
import { useCallback, useState } from 'react';
import styles from "./Carousel.module.css";

interface CarouselProps {
	gallery: Media[];
}

function Carousel({ gallery }: CarouselProps) {
	const [index, setIndex] = useState(0);
	const images = gallery.map((media, index) => {
		return (
			<Image
				key={`GalleryImage-${media.id}`}
				src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${media.url}`}
				alt={media.alternativeText}
				width={media.width} height={media.height}
				className={styles.image}
				priority={index === 0}
				blurDataURL={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${media.formats?.thumbnail.url}`}
			/>
		);
	});

	const scrollNext = useCallback(() => {
		let newIndex = index + 1;
		if (newIndex >= gallery.length) newIndex = 0;
		setIndex(newIndex);
	}, [index, gallery.length]);

	const scrollPrev = useCallback(() => {
		let newIndex = index - 1;
		if (newIndex < 0) newIndex = gallery.length - 1;
		setIndex(newIndex);
	}, [index, gallery.length]);

	return (
		<div>
			<div style={{ display: "inline-block", flexDirection: "column", width: "auto" }}>
				{images[index]}
				<div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
					<button onClick={scrollPrev}>Previous Image</button>
					<button onClick={scrollNext}>Next Image</button>
				</div>
			</div>
		</div>
	);
}

export default Carousel;