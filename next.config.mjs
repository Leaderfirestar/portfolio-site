/** @type {import('next').NextConfig} */
const remotePatterns = [
	{
		protocol: 'https',
		hostname: 'portfolio-api.eric-webb.dev',
		port: '', // The port Strapi is running on
		pathname: '/uploads/**', // Path pattern for Strapi images
	}
];

if (process.env.NODE_ENV === "development") remotePatterns.push({
	protocol: "http",
	hostname: "localhost",
	port: "1337",
	pathname: "/uploads/**"
});

const nextConfig = {
	images: {
		remotePatterns
	}
};

export default nextConfig;
