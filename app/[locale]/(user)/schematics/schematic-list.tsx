'use client';

import { PlusIcon, UserIcon } from 'lucide-react';
import { useRef } from 'react';

import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { Button } from '@/components/ui/button';
import useClientAPI from '@/hooks/use-client';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';
import { getSchematicCount } from '@/query/schematic';
import getSchematics from '@/query/schematic/get-schematics';

import { useQuery } from '@tanstack/react-query';

export default function SchematicList() {
  const { schematic } = useSearchTags();
  const params = useSearchPageParams();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const axios = useClientAPI();
  const { data } = useQuery({
    queryKey: ['schematics', 'count', params],
    queryFn: () => getSchematicCount(axios, params),
  });

  console.log(data);

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <NameTagSearch tags={schematic} />
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
      <div className="justify-between items-center flex">
        <span>Total schematic: {data}</span>
        <div className="flex gap-1">
          <Button
            title="My schematic"
            className="items-center flex gap-2  pl-1 pr-3"
            variant="secondary"
          >
            <UserIcon className="size-5" />
            My schematic
          </Button>
          <Button title="Add" className="items-center flex gap-2  pl-1 pr-3">
            <PlusIcon />
            Add your schematic
          </Button>
        </div>
      </div>
    </div>
  );
}
