import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'MindustryTool',
		short_name: 'MindustryTool',
		description: 'MindustryTool Progressive Web App',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/assets/bot-chan.jpeg',
				sizes: '192x192',
				type: 'image/jpeg',
			},
		],
	};
}
