const isProd = process.env.VERCEL_ENV === 'production';

module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_CANONICAL_URL,
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: isProd
			? [
				{ userAgent: '*', allow: '/' }
			]
			: [
				{ userAgent: '*', disallow: '/' }
			],
	},
};