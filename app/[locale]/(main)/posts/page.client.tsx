'use client';

import { UploadIcon } from 'lucide-react';

import InfinitePage from '@/components/common/infinite-page';
import InternalLink from '@/components/common/internal-link';
import { GridLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import PostPreviewCard from '@/components/post/post-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';

import env from '@/constant/env';
import { getPostCount, getPosts } from '@/query/post';
import { ItemPaginationQuery } from '@/types/schema/search-query';

export default function Client() {
	const uploadLink = `${env.url.base}/upload/post`;

	return (
		<div className="flex h-full w-full flex-col gap-2 overflow-hidden p-2">
			<NameTagSearch type="post" />
			<ScrollContainer>
				<InfinitePage
					className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-2"
					paramSchema={ItemPaginationQuery}
					queryKey={['posts']}
					queryFn={getPosts}
				>
					{(page) => page.map((data) => <PostPreviewCard key={data.id} post={data} />)}
				</InfinitePage>
			</ScrollContainer>
			<div className="flex gap-2 justify-between">
				<InternalLink variant="button-secondary" title="upload-post" href={uploadLink}>
					<UploadIcon />
					<Tran text="upload-post" />
				</InternalLink>
				<div className="flex justify-end items-center gap-2 flex-wrap">
					<PaginationLayoutSwitcher />
					<GridLayout>
						<PaginationNavigator numberOfItems={getPostCount} queryKey={['posts', 'total']} />
					</GridLayout>
				</div>
			</div>
		</div>
	);
}
