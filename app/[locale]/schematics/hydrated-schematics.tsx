import getQueryClient from '@/app/query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function HydratedPosts() {
	const queryClient = getQueryClient();
	await queryClient.prefetchQuery(['posts'], getPosts);
	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<Schematics />
		</HydrationBoundary>
	);
}
