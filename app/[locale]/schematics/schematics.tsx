'use client';
import { HTMLAttributes } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import SchematicPreview from '@/components/schematic/schematic-preview';
import LoadingSpinner from '@/components/ui/loading-spinner';
import getSchematics, { GetSchematicParams } from '@/data/get-schematics';
import Schematic from '@/types/Schematic';
import PreviewContainer from '@/components/preview/preview-container';

interface SchematicsProps extends HTMLAttributes<HTMLDivElement> {
	searchParams: GetSchematicParams;
}

export default function Schematics({ searchParams }: SchematicsProps) {
	const { data, isLoading } = useInfiniteQuery({
		queryKey: ['posts'],
		queryFn: () => getSchematics(searchParams),
		initialPageParam: searchParams,
		getNextPageParam: (lastPage: Schematic[], pages: Schematic[][], lastPageParams: GetSchematicParams) => {
			if (lastPage.length == 0) {
				return undefined;
			}
			lastPageParams.page += 1;
			return lastPageParams;
		},

		getPreviousPageParam: (lastPage: Schematic[], pages: Schematic[][], lastPageParams: GetSchematicParams) => {
			if (lastPage.length == 0 || lastPageParams.page <= 0) {
				return undefined;
			}
			lastPageParams.page -= 1;
			return lastPageParams;
		},
	});

	if (!data || isLoading) return <LoadingSpinner />;

	return (
		<PreviewContainer>
			{data.pages
				.reduce((prev, curr) => prev.concat(curr), [])
				.map((schematic) => (
					<SchematicPreview schematic={schematic} />
				))}
			Hello
		</PreviewContainer>
	);
}
