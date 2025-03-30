import React, { useMemo } from 'react';

import TagBadge from '@/components/tag/tag-badge';

import useTagSearch from '@/hooks/use-tag-search';
import Tag from '@/types/response/Tag';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

const MAX_DISPLAYED = 4;

type Props = {
  tagGroups: TagGroup[];
  handleDeleteTag?: (item: Tag) => void;
};

export default function TagBadgeContainer({ tagGroups, handleDeleteTag }: Props) {
  const tagNames = useMemo(() => TagGroups.toStringArray(tagGroups), [tagGroups]);
  let { data } = useTagSearch(tagNames);

  data = data ?? [];

  if (data.length === 0) {
    return undefined;
  }

  return (
    <section className="flex gap-1 shrink-0">
      {data?.slice(0, MAX_DISPLAYED).map((item) => <TagBadge key={item.name} tag={item} onDelete={handleDeleteTag && ((tag) => handleDeleteTag(tag))} />)}
      {data.length > MAX_DISPLAYED && <span className="flex items-center gap-0.5 flex-nowrap whitespace-nowrap rounded-full px-2 py-1 text-center text-xs text-brand-foreground bg-green-400">{data.length - MAX_DISPLAYED}+</span>}
    </section>
  );
}
