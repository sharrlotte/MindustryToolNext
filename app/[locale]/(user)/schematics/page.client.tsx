'use client';

import { useRef } from 'react';

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
import useClientQuery from '@/hooks/use-client-query';
import useSearchQuery from '@/hooks/use-search-query';
import { omit } from '@/lib/utils';
import { getSchematicCount, getSchematics } from '@/query/schematic';
import { ItemPaginationQuery } from '@/query/search-query';
import { Schematic } from '@/types/response/Schematic';

type Props = {
  schematics: Schematic[];
};

export default function Client({ schematics }: Props) {
  const params = useSearchQuery(ItemPaginationQuery);

  const uploadLink = `${env.url.base}/upload/schematic`;

  const container = useRef<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: ['schematics', 'total', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => getSchematicCount(axios, params),
    placeholderData: 0,
  });

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      <NameTagSearch type="schematic" />
      <div className="flex justify-end items-center">
        <PaginationLayoutSwitcher />
      </div>
      <ScrollContainer className="relative flex h-full flex-col" ref={container}>
        <ListLayout>
          <InfinitePage
            params={params}
            queryKey={['schematics']}
            queryFn={getSchematics}
            container={() => container.current}
            initialData={schematics}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
          >
            {(data, index) => <SchematicPreviewCard key={data.id} schematic={data} imageCount={index} />}
          </InfinitePage>
        </ListLayout>
        <GridLayout>
          <GridPaginationList
            params={params}
            queryKey={['schematics']}
            queryFn={getSchematics}
            initialData={schematics}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
          >
            {(data, index) => <SchematicPreviewCard key={data.id} schematic={data} imageCount={index} />}
          </GridPaginationList>
        </GridLayout>
      </ScrollContainer>
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <InternalLink variant="button-secondary" href={uploadLink}>
          <UploadIcon />
          <Tran text="upload-schematic" />
        </InternalLink>
        <GridLayout>
          <PaginationNavigator numberOfItems={data} />
        </GridLayout>
      </div>
    </div>
  );
}
