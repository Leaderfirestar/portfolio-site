const isProd = process.env.VERCEL_ENV === 'production';

module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
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