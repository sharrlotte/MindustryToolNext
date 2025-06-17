import SortTag from '@/types/response/SortTag';

const env = {
	webVersion: process.env.NEXT_PUBLIC_BUILD_VERSION,
	webName: 'Mindustry Tool',
	locales: ['en', 'vi', 'kr', 'cn', 'jp', 'ru', 'uk'] as const,
	defaultLocale: 'en',
	imageFormat: '.webp',
	requestTimeout: parseInt(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT || '3000') || 3000,
	url: {
		socket: process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL as string,
		base: process.env.NEXT_PUBLIC_FRONTEND_URL as string,
		api: process.env.NEXT_PUBLIC_BACKEND_URL as string,
		image: process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_URL as string,
		bot: 'https://discord.com/oauth2/authorize?client_id=918818673626599434',
		discordServer: 'https://discord.gg/DD2sf4NVhn',
	},
	supportedImageFormat: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
};

export default env;

export const defaultSortTag: SortTag = 'time_desc';
