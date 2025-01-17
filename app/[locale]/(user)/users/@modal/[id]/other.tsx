'use client';

import React, { useRef } from 'react';

import UserDetail from '@/app/[locale]/(user)/users/@modal/[id]/user-detail';

import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
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

import useSearchQuery from '@/hooks/use-search-query';
import { ItemPaginationQuery } from '@/query/search-query';
import { getUserMaps, getUserPosts, getUserSchematics } from '@/query/user';
import { User } from '@/types/response/User';

type TabProps = {
  user: User;
};
export default function Other({ user }: TabProps) {
  const id = user.id;

  const params = useSearchQuery(ItemPaginationQuery);
  const container = useRef<HTMLDivElement | null>(null);

  return (
    <ScrollContainer className="absolute inset-0 space-y-2 bg-background p-2" ref={container}>
      <UserDetail user={user} />
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
            <NameTagSearch type="schematic" />
            <InfinitePage
              params={params}
              queryKey={['users', id, 'schematics']}
              queryFn={(axios, params) => getUserSchematics(axios, id, params)}
              container={() => container.current}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data, index) => (data.isVerified ? <SchematicPreviewCard key={data.id} schematic={data} imageCount={index} /> : <UploadSchematicPreviewCard key={data.id} schematic={data} imageCount={index} />)}
            </InfinitePage>
          </div>
        </TabsContent>
        <TabsContent value="map">
          <div className="flex h-full w-full flex-col gap-2">
            <NameTagSearch type="map" />
            <InfinitePage
              params={params}
              queryKey={['users', id, 'maps']}
              queryFn={(axios, params) => getUserMaps(axios, id, params)}
              container={() => container.current}
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
            <NameTagSearch type="post" />
            <InfinitePage
              className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-2"
              params={params}
              queryKey={['users', id, 'posts']}
              queryFn={(axios, params) => getUserPosts(axios, id, params)}
              container={() => container.current}
            >
              {(data) => (data.isVerified ? <PostPreviewCard key={data.id} post={data} /> : <UploadPostPreviewCard key={data.id} post={data} />)}
            </InfinitePage>
          </div>
        </TabsContent>
      </Tabs>
    </ScrollContainer>
  );
}
