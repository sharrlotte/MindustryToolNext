'use client';

import { useState } from 'react';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InternalLink from '@/components/common/internal-link';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import env from '@/constant/env';
import useClientQuery from '@/hooks/use-client-query';
import useSearchQuery from '@/hooks/use-search-query';
import useTags from '@/hooks/use-tags';
import { ItemPaginationQuery } from '@/query/search-query';
import { getSchematicCount, getSchematics } from '@/query/schematic';
import { omit } from '@/lib/utils';
import Tran from '@/components/common/tran';
import { UploadIcon, UserIcon } from '@/components/common/icons';
import InfinitePage from '@/components/common/infinite-page';
import { Schematic } from '@/types/response/Schematic';

type Props = {
  schematics: Schematic[];
};

export default function Client({ schematics }: Props) {
  const {
    searchTags: { schematic },
  } = useTags();
  const params = useSearchQuery(ItemPaginationQuery);

  const uploadLink = `${env.url.base}/upload/schematic`;
  const mySchematicLink = `${env.url.base}/users/@me`;

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: ['schematics', 'total', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => getSchematicCount(axios, params),
    placeholderData: 0,
  });

  let imageCount = 0;

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      <NameTagSearch tags={schematic} />
      <div className="flex justify-between">
        <Tran text="found" args={{ number: data }} />
        <PaginationLayoutSwitcher />
      </div>
      <ListLayout>
        <div className="relative flex h-full flex-col overflow-auto" ref={(ref) => setContainer(ref)}>
          <InfinitePage
            params={params}
            queryKey={['schematics']}
            getFunc={getSchematics}
            container={() => container}
            initialData={schematics}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
          >
            {(data) => <SchematicPreviewCard key={data.id} schematic={data} imageCount={imageCount++} />}
          </InfinitePage>
        </div>
      </ListLayout>
      <GridLayout>
        <GridPaginationList
          params={params}
          queryKey={['schematics']}
          getFunc={getSchematics}
          initialData={schematics}
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
        >
          {(data) => <SchematicPreviewCard key={data.id} schematic={data} imageCount={imageCount++} />}
        </GridPaginationList>
      </GridLayout>
      <div className="flex flex-wrap items-center justify-end gap-2 sm:flex-row-reverse sm:justify-between">
        <GridLayout>
          <PaginationNavigator numberOfItems={data} />
        </GridLayout>
        <div className="flex gap-2">
          <InternalLink variant="button-secondary" href={mySchematicLink}>
            <UserIcon />
            <Tran text="my-schematic" />
          </InternalLink>
          <InternalLink variant="button-secondary" href={uploadLink}>
            <UploadIcon />
            <Tran text="upload-schematic" />
          </InternalLink>
        </div>
      </div>
    </div>
  );
}
