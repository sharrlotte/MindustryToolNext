'use client';

import InfinitePage from '@/components/common/infinite-page';
import MapPreviewCard from '@/components/map/map-preview-card';
import PostPreviewCard from '@/components/post/post-preview-card';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserAvatar from '@/components/user/user-avatar';
import UserRoleCard from '@/components/user/user-role';
import useStatusSearchParams from '@/hooks/use-status-search-params';
import { useSearchTags } from '@/hooks/use-tags';
import { useI18n } from '@/locales/client';
import getMePosts from '@/query/post/get-me-posts';
import getMeMaps from '@/query/user/get-me-maps';
import getMeSchematics from '@/query/user/get-me-schematics';
import { User } from '@/types/response/User';
import React, { useRef } from 'react';

type TabProps = {
  me: User;
};
export default function Tab({ me }: TabProps) {
  const t = useI18n();
  const { schematic, map, post } = useSearchTags();
  const scrollContainer = useRef<HTMLDivElement | null>();
  const params = useStatusSearchParams();

  return (
    <div
      className="absolute inset-0 space-y-2 overflow-auto bg-background p-4"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <div className="flex gap-2 rounded-md bg-card p-2">
        <UserAvatar className="h-20 w-20" user={me} />
        <div className="flex h-full flex-col justify-between">
          <span className="text-2xl capitalize">{me.name}</span>
          <UserRoleCard className="text-2xl" roles={me.roles} />
        </div>
      </div>
      <Tabs className="w-full" defaultValue="schematic">
        <TabsList className="w-full justify-start bg-card">
          <TabsTrigger value="schematic">{t('schematic')}</TabsTrigger>
          <TabsTrigger value="map">{t('map')}</TabsTrigger>
          <TabsTrigger value="post">{t('post')}</TabsTrigger>
        </TabsList>
        <TabsContent value="schematic">
          <div className="relative flex h-full flex-col gap-4">
            <NameTagSearch tags={schematic} />
            <InfinitePage
              params={params}
              queryKey={['me-schematics']}
              getFunc={getMeSchematics}
              scrollContainer={scrollContainer.current}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data) => (
                <SchematicPreviewCard key={data.id} schematic={data} />
              )}
            </InfinitePage>
          </div>
        </TabsContent>
        <TabsContent value="map">
          <div className="flex h-full w-full flex-col gap-4">
            <NameTagSearch tags={map} />
            <InfinitePage
              params={params}
              queryKey={['me-maps']}
              getFunc={getMeMaps}
              scrollContainer={scrollContainer.current}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data) => <MapPreviewCard key={data.id} map={data} />}
            </InfinitePage>
          </div>
        </TabsContent>
        <TabsContent value="post">
          <div className="flex h-full w-full flex-col gap-4">
            <NameTagSearch tags={post} />
            <InfinitePage
              className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-4"
              params={params}
              queryKey={['me-posts']}
              getFunc={getMePosts}
              scrollContainer={scrollContainer.current}
            >
              {(data) => <PostPreviewCard key={data.id} post={data} />}
            </InfinitePage>
          </div>{' '}
        </TabsContent>
      </Tabs>
    </div>
  );
}
