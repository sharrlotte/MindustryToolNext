'use client';

import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';

import { getImages } from '@/query/image';
import { PaginationQuerySchema } from '@/query/search-query';

export default function Page() {
	return (
		<div className="p-4">
			<ScrollContainer>
				<InfinitePage queryKey={['images']} paramSchema={PaginationQuerySchema} queryFn={getImages}>
					{(data) => <div key={data.path}>{data.name}</div>}
				</InfinitePage>
			</ScrollContainer>
		</div>
	);
}
