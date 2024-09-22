/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'portfolio-api.eric-webb.dev',
				port: '', // The port Strapi is running on
				pathname: '/uploads/**', // Path pattern for Strapi images
			}
		]
	}
};

export default nextConfig;
