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
	const media = gallery[index];

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
		<div className={styles.carousel}>
			<div className={styles.stage}>
				{gallery.map((media, i) => (
					<div
						key={media.id}
						className={`${styles.slide} ${i === index ? styles.active : ""}`}
					>
						<Image
							src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${media.url}`}
							alt={media.alternativeText}
							fill
							sizes="(max-width: 1100px) 100vw, 1100px"
							priority={i === 0}
							placeholder={media.formats?.thumbnail ? "blur" : undefined}
							blurDataURL={
								media.formats?.thumbnail
									? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${media.formats.thumbnail.url}`
									: undefined
							}
						/>
					</div>
				))}
			</div>
			<div className={styles.controls}>
				<button onClick={scrollPrev}>Previous</button>
				<button onClick={scrollNext}>Next</button>
			</div>
		</div>
	);
}

export default Carousel;