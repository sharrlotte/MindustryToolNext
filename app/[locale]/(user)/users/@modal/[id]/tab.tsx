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
import useSearchPageParams from '@/hooks/use-search-page-params';
import useTags from '@/hooks/use-tags';
import { useI18n } from '@/locales/client';
import getUserMaps from '@/query/user/get-user-maps';
import getUserPosts from '@/query/user/get-user-posts';
import getUserSchematics from '@/query/user/get-user-schematics';
import { User } from '@/types/response/User';
import React, { useRef } from 'react';

type TabProps = {
  user: User;
};
export default function Tab({ user }: TabProps) {
  const t = useI18n();
  const id = user.id;
  const { schematic, map, post } = useTags();
  const params = useSearchPageParams();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="absolute inset-0 space-y-2 overflow-y-auto bg-background p-4"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <div className="flex gap-2 rounded-md bg-card p-2">
        <UserAvatar className="h-20 w-20" user={user} />
        <div className="flex h-full flex-col justify-between">
          <span className="text-2xl capitalize">{user.name}</span>
          <UserRoleCard className="text-2xl" roles={user.roles} />
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
              queryKey={['user-schematics']}
              getFunc={(axios, params) => getUserSchematics(axios, id, params)}
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
              queryKey={['user-maps']}
              getFunc={(axios, params) => getUserMaps(axios, id, params)}
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
              queryKey={['user-posts']}
              getFunc={(axios, params) => getUserPosts(axios, id, params)}
              scrollContainer={scrollContainer.current}
            >
              {(data) => <PostPreviewCard key={data.id} post={data} />}
            </InfinitePage>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
