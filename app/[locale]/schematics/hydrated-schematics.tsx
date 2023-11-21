import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/app/query-client';
import { HTMLAttributes } from 'react';
import getSchematics, { GetSchematicParams } from '@/data/get-schematics';
import Schematics from './schematics';

interface HydratedSchematicProps extends HTMLAttributes<HTMLDivElement> {
	searchParams: GetSchematicParams;
}

export default async function HydratedSchematic({ searchParams }: HydratedSchematicProps) {
	const queryClient = getQueryClient();
	await queryClient.prefetchQuery({
		queryKey: ['schematics', searchParams],
		queryFn: () => getSchematics(searchParams),
	});

	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<Schematics searchParams={searchParams} />
		</HydrationBoundary>
	);
}
