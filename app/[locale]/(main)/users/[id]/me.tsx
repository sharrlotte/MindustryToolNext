'use client';

import React from 'react';

import UserDetail from '@/app/[locale]/(main)/users/[id]/user-detail';

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

import { getMeMaps, getMePosts, getMeSchematics } from '@/query/user';
import { User } from '@/types/response/User';
import { StatusSearchSchema } from '@/types/schema/search-query';

type TabProps = {
	me: User;
};
export default function Me({ me }: TabProps) {
	return (
		<div className="absolute inset-0 space-y-2 overflow-auto bg-background p-2">
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
					<div className="relative flex h-full flex-col gap-2 min-h-dvh">
						<NameTagSearch type="schematic" />
						<InfinitePage
							paramSchema={StatusSearchSchema}
							queryKey={['me', 'schematics']}
							queryFn={getMeSchematics}
							skeleton={{
								amount: 20,
								item: <PreviewSkeleton />,
							}}
						>
							{(data) => (data.isVerified ? <SchematicPreviewCard key={data.id} schematic={data} /> : <UploadSchematicPreviewCard key={data.id} schematic={data} />)}
						</InfinitePage>
					</div>
				</TabsContent>
				<TabsContent value="map">
					<div className="flex h-full w-full flex-col gap-2 min-h-dvh">
						<NameTagSearch type="map" />
						<InfinitePage
							paramSchema={StatusSearchSchema}
							queryKey={['me', 'maps']}
							queryFn={getMeMaps}
							skeleton={{
								amount: 20,
								item: <PreviewSkeleton />,
							}}
						>
							{(data) => (data.isVerified ? <MapPreviewCard key={data.id} map={data} /> : <UploadMapPreview key={data.id} map={data} />)}
						</InfinitePage>
					</div>
				</TabsContent>
				<TabsContent value="post">
					<div className="flex h-full w-full flex-col gap-2 min-h-dvh">
						<NameTagSearch type="post" />
						<InfinitePage
							className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-2"
							paramSchema={StatusSearchSchema}
							queryKey={['me', 'posts']}
							queryFn={getMePosts}
						>
							{(data) => (data.isVerified ? <PostPreviewCard key={data.id} post={data} /> : <UploadPostPreviewCard key={data.id} post={data} />)}
						</InfinitePage>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
