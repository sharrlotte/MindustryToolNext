'use client';

import { useState } from 'react';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InternalLink from '@/components/common/internal-link';
import {
  GridLayout,
  ListLayout,
  PaginationLayoutSwitcher,
} from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import env from '@/constant/env';
import useClientQuery from '@/hooks/use-client-query';
import useSearchQuery from '@/hooks/use-search-query';
import { useSearchTags } from '@/hooks/use-tags';
import { ItemPaginationQuery } from '@/query/search-query';
import { getSchematicCount, getSchematics } from '@/query/schematic';
import { omit } from '@/lib/utils';
import Tran from '@/components/common/tran';
import { UploadIcon, UserIcon } from '@/components/common/icons';

export default function SchematicList() {
  const { schematic } = useSearchTags();
  const params = useSearchQuery(ItemPaginationQuery);

  const uploadLink = `${env.url.base}/upload/schematic`;
  const mySchematicLink = `${env.url.base}/users/@me`;

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: ['schematics', 'total', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => getSchematicCount(axios, params),
    placeholderData: 0,
  });

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <NameTagSearch tags={schematic} />
      <div className="flex justify-between">
        <Tran text={`Found ${data} schematics`} />
        <PaginationLayoutSwitcher />
      </div>
      <ListLayout>
        <div
          className="relative flex h-full flex-col overflow-auto"
          ref={(ref) => setContainer(ref)}
        >
          <ResponsiveInfiniteScrollGrid
            params={params}
            queryKey={['schematics']}
            getFunc={getSchematics}
            container={() => container}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
            itemMinWidth={320}
            itemMinHeight={352}
            contentOffsetHeight={112}
            gap={8}
          >
            {(data) => <SchematicPreviewCard key={data.id} schematic={data} />}
          </ResponsiveInfiniteScrollGrid>
        </div>
      </ListLayout>
      <GridLayout>
        <GridPaginationList
          params={params}
          queryKey={['schematics']}
          getFunc={getSchematics}
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
        >
          {(data) => <SchematicPreviewCard key={data.id} schematic={data} />}
        </GridPaginationList>
      </GridLayout>
      <div className="flex flex-wrap items-center justify-end gap-4 sm:flex-row-reverse sm:justify-between">
        <GridLayout>
          <PaginationNavigator numberOfItems={data} />
        </GridLayout>
        <div className="flex gap-2">
          <InternalLink
            variant="button-secondary"
            title="my-schematic"
            href={mySchematicLink}
          >
            <UserIcon />
            <Tran text="my-schematic" />
          </InternalLink>
          <InternalLink
            variant="button-secondary"
            title="upload-schematic"
            href={uploadLink}
          >
            <UploadIcon />
            <Tran text="upload-schematic" />
          </InternalLink>
        </div>
      </div>
    </div>
  );
}
