"use client";

import { Media } from "@/lib/defintions";
import Image from "next/image";
import { useCallback, useState } from 'react';

interface EmblaCarouselProps {
	gallery: Media[];
}

// Client side rendered to make use of the hook. Need to optimize image stuff
function Carousel({ gallery }: EmblaCarouselProps) {
	const [index, setIndex] = useState(0);

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
				<Image src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${gallery[index].url}`} alt={gallery[index].alternativeText} width={gallery[index].width} height={gallery[index].height} style={{ maxHeight: "400px", width: "auto", objectFit: "contain" }} />
				<div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
					<button onClick={scrollPrev}>&lt;</button>
					<button onClick={scrollNext}>&gt;</button>
				</div>
			</div>
		</div>
	);
}

export default Carousel;