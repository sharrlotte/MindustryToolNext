import TagCard from '@/components/tag/tag-card';
import { cn } from '@/lib/utils';
import Tag from '@/types/response/Tag';
import React from 'react';

type TagContainerProps = {
  className?: string;
  tags?: Tag[];
  handleDeleteTag?: (item: Tag) => void;
};

export default function TagContainer({
  className,
  tags,
  handleDeleteTag,
}: TagContainerProps) {
  if (tags === undefined || tags.length === 0) {
    return <></>;
  }

  return (
    <section className={cn('flex w-full flex-wrap gap-1', className)}>
      {tags.map((item) => (
        <TagCard
          key={item.name + item.value}
          tag={item}
          onDelete={handleDeleteTag && (() => handleDeleteTag(item))}
        />
      ))}
    </section>
  );
}
