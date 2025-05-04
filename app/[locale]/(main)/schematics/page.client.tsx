'use client';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout } from '@/components/common/pagination-layout';
import ScrollContainer from '@/components/common/scroll-container';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import PreviewSkeleton from '@/components/skeleton/preview.skeleton';

import { getSchematics } from '@/query/schematic';
import { ItemPaginationQuery } from '@/types/schema/search-query';

export default function Client() {
	return (
		<ScrollContainer className="relative flex h-full flex-col">
			<ListLayout>
				<InfinitePage
					paramSchema={ItemPaginationQuery}
					queryKey={['schematics']}
					queryFn={getSchematics}
					skeleton={{
						amount: 20,
						item: <PreviewSkeleton />,
					}}
				>
					{(page) => page.map((data) => <SchematicPreviewCard key={data.id} schematic={data} />)}
				</InfinitePage>
			</ListLayout>
			<GridLayout>
				<GridPaginationList
					paramSchema={ItemPaginationQuery}
					queryKey={['schematics']}
					queryFn={getSchematics}
					skeleton={{
						amount: 20,
						item: <PreviewSkeleton />,
					}}
				>
					{(page) => page.map((data) => <SchematicPreviewCard key={data.id} schematic={data} />)}
				</GridPaginationList>
			</GridLayout>
		</ScrollContainer>
	);
}
