"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from 'react';

interface Slide {
	id: number;
	url: string;
	alt: string;
}

interface EmblaCarouselProps {
	slides: Slide[];
}

// Heavy inspiration from this article
// https://learnnext-blog.vercel.app/blogs/adding-embla-carousel-to-nextjs-application
// Client side rendered to make use of the hook. Need to optimize image stuff
function EmblaCarouselComponent({ slides }: EmblaCarouselProps) {
	const [ref, embla] = useEmblaCarousel({
		align: "start",
		loop: true,
		inViewThreshold: .7
	});

	const scrollPrev = useCallback(() => {
		if (embla) embla.scrollPrev();
	}, [embla]);

	const scrollNext = useCallback(() => {
		if (embla) embla.scrollNext();
	}, [embla]);

	return (
		<div className="embla">
			<div className="embla__viewport" ref={ref}>
				<div className="embla__container">
					{/* Your slides */}
					{slides.map(slide => (
						<div className="embla__slide" key={slide.id}>
							<img src={slide.url} alt={slide.alt} className="embla__image" />
						</div>
					))}
				</div>
			</div>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
				<button onClick={scrollPrev}>&lt;</button>
				<button onClick={scrollNext}>&gt;</button>
			</div>
		</div>
	);
}

export default EmblaCarouselComponent;