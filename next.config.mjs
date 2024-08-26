/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '1337', // The port Strapi is running on
				pathname: '/uploads/**', // Path pattern for Strapi images
			}
		]
	}
};

export default nextConfig;
