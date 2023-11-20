const cfg = {
	webVersion: 'Beta 0.9.0',
	themes: ['light', 'dark', 'system'],
	locales: ['vi', 'en-US'],
	defaultLocale: 'en-US',
	apiUrl: process.env.BACKEND_URL as string,
};

export default cfg;
