import React from 'react';

import TagBadge from '@/components/tag/tag-badge';

import Tag from '@/types/response/Tag';

type Props = {
  tags: Tag[];
  handleDeleteTag?: (item: Tag) => void;
};

const MAX_DISPLAYED = 4;

export default function TagBadgeContainer({ tags, handleDeleteTag }: Props) {
  return (
    <section className="flex gap-1">
      {tags.slice(0, MAX_DISPLAYED).map((item) => (
        <TagBadge key={item.name + item.value} tag={item} onDelete={handleDeleteTag && (() => handleDeleteTag(item))} />
      ))}
      {tags.length > MAX_DISPLAYED && <span className="flex items-center gap-0.5 flex-nowrap whitespace-nowrap rounded-full px-2 py-1 text-center text-xs text-brand-foreground bg-green-400">{tags.length - MAX_DISPLAYED}+</span>}
    </section>
  );
}
