'use client';

import { omit } from 'lodash';
import { PlusIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';

import GridPaginationList from '@/components/common/grid-pagination-list';
import {
  PaginationLayout,
  PaginationLayoutSwitcher,
} from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { Button } from '@/components/ui/button';
import useClientQuery from '@/hooks/use-client-query';
import useSearchQuery, { ItemPaginationQuery } from '@/hooks/use-search-query';
import { useSearchTags } from '@/hooks/use-tags';
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
      <PaginationLayout
        list={
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
              {(data) => (
                <SchematicPreviewCard key={data.id} schematic={data} />
              )}
            </ResponsiveInfiniteScrollGrid>
          </div>
        }
        grid={
          <GridPaginationList
            params={params}
            queryKey={['schematics']}
            getFunc={getSchematics}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
            numberOfItems={data ?? 0}
          >
            {(data) => <SchematicPreviewCard key={data.id} schematic={data} />}
          </GridPaginationList>
        }
      />
      <div className="sm:justify-between justify-end sm:flex-row-reverse items-center flex flex-wrap gap-4">
        <PaginationNavigator numberOfItems={data ?? 0} />
        <div className="flex gap-1">
          <Button
            title="My schematic"
            className="items-center flex gap-2 pl-1 pr-3"
          >
            <UserIcon className="size-5" />
            My schematic
          </Button>
          <Button title="Add" className="items-center flex gap-2 pl-1 pr-3">
            <PlusIcon />
            Add your schematic
          </Button>
        </div>
      </div>
    </div>
  );
}
