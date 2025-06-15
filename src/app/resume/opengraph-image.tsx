// app/resume/og/image.tsx
import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const alt = "Eric Webb's Resume";
export const size = {
	width: 1200,
	height: 630,
};

export default async function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					background: "#066D77",
					width: "100%",
					height: "100%",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					color: "#FFDDD2"
				}}
			>
				<h1 style={{ fontSize: "3rem", marginBottom: "0px", marginTop: "0px", fontWeight: 800 }}>Eric Webb | Software Engineer</h1>
				<p style={{ fontSize: "2rem" }}>Resume</p>
			</div >
		),
		{
			width: 1200,
			height: 630,
		}
	);
}