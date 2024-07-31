'use client';

import { omit } from 'lodash';
import { PlusIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import GridPaginationList from '@/components/common/grid-pagination-list';
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
import { ItemPaginationQuery } from '@/query/query';
import { getSchematicCount } from '@/query/schematic';
import getSchematics from '@/query/schematic/get-schematics';

export default function SchematicList() {
  const { schematic } = useSearchTags();
  const params = useSearchQuery(ItemPaginationQuery);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: ['schematics', 'count', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => getSchematicCount(axios, params),
  });

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <NameTagSearch tags={schematic} />
      <div className="flex justify-between">
        <span>Found {data} schematics</span>
        <PaginationLayoutSwitcher />
      </div>
      <ListLayout>
        <div
          className="relative flex h-full flex-col overflow-auto"
          ref={(ref) => setContainer(ref)}
        >
          <ResponsiveInfiniteScrollGrid
            params={params}
            queryKey={['schematic']}
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
          queryKey={['schematic']}
          getFunc={getSchematics}
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
        >
          {(data) => <SchematicPreviewCard key={data.id} schematic={data} />}
        </GridPaginationList>
      </GridLayout>
      <div className="sm:justify-between justify-end sm:flex-row-reverse items-center flex flex-wrap gap-4">
        <GridLayout>
          <PaginationNavigator numberOfItems={data ?? 0} />
        </GridLayout>
        <div className="flex gap-1">
          <Link
            className="items-center flex gap-2 py-1 pl-1 pr-3 border border-border rounded-md"
            href={`${env.url.base}/users/me`}
            title="My schematic"
          >
            <UserIcon className="size-5" />
            My schematic
          </Link>
          <Link
            className="items-center flex gap-2 py-1 pl-1 pr-3 border border-border rounded-md"
            href={`${env.url.base}/upload/schematic`}
            title="My schematic"
          >
            <PlusIcon className="size-5" />
            Add schematic
          </Link>
        </div>
      </div>
    </div>
  );
}