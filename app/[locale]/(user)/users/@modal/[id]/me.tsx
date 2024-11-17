'use client';

import React, { useState } from 'react';

import UserDetail from '@/app/[locale]/(user)/users/@modal/[id]/user-detail';
import InfinitePage from '@/components/common/infinite-page';
import Tran from '@/components/common/tran';
import MapPreviewCard from '@/components/map/map-preview-card';
import UploadMapPreview from '@/components/map/upload-map-preview-card';
import PostPreviewCard from '@/components/post/post-preview-card';
import UploadPostPreviewCard from '@/components/post/upload-post-preview-card';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import UploadSchematicPreviewCard from '@/components/schematic/upload-schematic-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTags } from '@/context/tags-context.client';
import useStatusSearchParams from '@/hooks/use-status-search-params';
import { getMeMaps, getMePosts, getMeSchematics } from '@/query/user';
import { User } from '@/types/response/User';

type TabProps = {
  me: User;
};
export default function Me({ me }: TabProps) {
  const {
    searchTags: { schematic, map, post },
  } = useTags();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const params = useStatusSearchParams();

  return (
    <div className="absolute inset-0 space-y-2 overflow-auto bg-background p-2" ref={(ref) => setContainer(ref)}>
      <UserDetail user={me} />
      <Tabs className="w-full" defaultValue="schematic">
        <TabsList className="w-full justify-start bg-card">
          <TabsTrigger value="schematic">
            <Tran text="schematic" />
          </TabsTrigger>
          <TabsTrigger value="map">
            <Tran text="map" />
          </TabsTrigger>
          <TabsTrigger value="post">
            <Tran text="post" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="schematic">
          <div className="relative flex h-full flex-col gap-2">
            <NameTagSearch tags={schematic} />
            <InfinitePage
              params={params}
              queryKey={['me', 'schematics']}
              getFunc={getMeSchematics}
              container={() => container}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data, index) =>
                data.isVerified ? <SchematicPreviewCard key={data.id} schematic={data} imageCount={index} /> : <UploadSchematicPreviewCard key={data.id} schematic={data} imageCount={index} />
              }
            </InfinitePage>
          </div>
        </TabsContent>
        <TabsContent value="map">
          <div className="flex h-full w-full flex-col gap-2">
            <NameTagSearch tags={map} />
            <InfinitePage
              params={params}
              queryKey={['me', 'maps']}
              getFunc={getMeMaps}
              container={() => container}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data, index) => (data.isVerified ? <MapPreviewCard key={data.id} map={data} imageCount={index} /> : <UploadMapPreview key={data.id} map={data} imageCount={index} />)}
            </InfinitePage>
          </div>
        </TabsContent>
        <TabsContent value="post">
          <div className="flex h-full w-full flex-col gap-2">
            <NameTagSearch tags={post} />
            <InfinitePage
              className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-2"
              params={params}
              queryKey={['me', 'posts']}
              getFunc={getMePosts}
              container={() => container}
            >
              {(data) => (data.isVerified ? <PostPreviewCard key={data.id} post={data} /> : <UploadPostPreviewCard key={data.id} post={data} />)}
            </InfinitePage>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
