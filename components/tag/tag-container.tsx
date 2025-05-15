import React, { Suspense, useMemo } from 'react';

import TagCard from '@/components/tag/tag-card';

import useTagSearch from '@/hooks/use-tag-search';
import { cn, groupBy } from '@/lib/utils';
import Tag from '@/types/response/Tag';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

type TagContainerProps = {
	className?: string;
	tagGroups: TagGroup[];
	handleDeleteTag?: (item: Tag) => void;
};

export default function TagContainer({ className, tagGroups, handleDeleteTag }: TagContainerProps) {
	const tagNames = useMemo(() => TagGroups.toStringArray(tagGroups), [tagGroups]);
	let { data } = useTagSearch(tagNames);

	data = data ?? [];

	return (
		<Suspense>
			<section className={cn('flex w-full flex-wrap gap-1', className)}>
				{groupBy(data, (t) => t.categoryPosition)
					.sort((a, b) => a.key - b.key)
					.map((items) =>
						items.value
							.sort((a, b) => a.position - b.position)
							.map((item) => (
								<TagCard key={item.name} tag={item} onDelete={handleDeleteTag && ((tag) => handleDeleteTag(tag))} />
							)),
					)}
			</section>
		</Suspense>
	);
}
