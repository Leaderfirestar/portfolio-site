import { Media } from "@/lib/defintions";
import Image from "next/image";

interface Props {
	classname?: string;
	media: Media;
}

function DownloadButton(props: Props) {
	const {
		classname,
		media
	} = props;

	return (
		<a href={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${media.url}`} download={media.name} className={classname}>
			<Image width={24} height={24} alt={`Download ${media.name}`} src="/download.svg" />
		</a>
	);
}

export default DownloadButton;