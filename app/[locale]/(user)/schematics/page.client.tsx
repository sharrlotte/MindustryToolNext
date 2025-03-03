'use client';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout } from '@/components/common/pagination-layout';
import ScrollContainer from '@/components/common/scroll-container';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';

import { getSchematics } from '@/query/schematic';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';
import { Schematic } from '@/types/response/Schematic';

type Props = {
  schematics: Schematic[];
  params: ItemPaginationQueryType;
};

export default function Client({ schematics, params }: Props) {

  return (
   
      <ScrollContainer className="relative flex h-full flex-col">
        <ListLayout>
          <InfinitePage
            paramSchema={ItemPaginationQuery}
            initialParams={params}
            queryKey={['schematics']}
            queryFn={getSchematics}
            initialData={schematics}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
          >
            {(data) => <SchematicPreviewCard key={data.id} schematic={data} />}
          </InfinitePage>
        </ListLayout>
        <GridLayout>
          <GridPaginationList
            paramSchema={ItemPaginationQuery}
            initialParams={params}
            queryKey={['schematics']}
            queryFn={getSchematics}
            initialData={schematics}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
          >
            {(data) => <SchematicPreviewCard key={data.id} schematic={data} />}
          </GridPaginationList>
        </GridLayout>
      </ScrollContainer>
  );
}
