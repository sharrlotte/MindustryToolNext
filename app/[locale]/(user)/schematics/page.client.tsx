'use client';

import GridPaginationList from '@/components/common/grid-pagination-list';
import { UploadIcon } from '@/components/common/icons';
import InfinitePage from '@/components/common/infinite-page';
import InternalLink from '@/components/common/internal-link';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';

import env from '@/constant/env';
import { getSchematicCount, getSchematics } from '@/query/schematic';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';
import { Schematic } from '@/types/response/Schematic';

type Props = {
  schematics: Schematic[];
  params: ItemPaginationQueryType;
};

export default function Client({ schematics, params }: Props) {
  const uploadLink = `${env.url.base}/upload/schematic`;

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      <NameTagSearch type="schematic" />
      <div className="flex justify-end items-center">
        <PaginationLayoutSwitcher />
      </div>
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
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <InternalLink variant="button-secondary" href={uploadLink}>
          <UploadIcon />
          <Tran text="upload-schematic" />
        </InternalLink>
        <GridLayout>
          <PaginationNavigator numberOfItems={getSchematicCount} queryKey={['schematics', 'total']} />
        </GridLayout>
      </div>
    </div>
  );
}
