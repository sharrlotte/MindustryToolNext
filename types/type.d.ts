declare global {
	type QueryKey = (
		| 'schematics'
		| 'maps'
		| 'posts'
		| 'schematic-uploads'
		| 'map-uploads'
		| 'post-uploads'
		| 'total-schematic-uploads'
		| 'total-map-uploads'
		| 'total-post-uploads'
		| 'servers'
		| 'logs'
		| 'user-schematics'
		| 'user-maps'
		| 'user-posts'
		| 'me-schematics'
		| 'me-maps'
		| 'me-posts'
		| 'server-files'
	) &
		any;

	type TQueryKey = QueryKey;

	namespace NodeJS {
		interface ProcessEnv {
			SENTRY: boolean;
		}
	}
}
