import { XIcon } from 'lucide-react';
import React, { HTMLAttributes } from 'react';

import TagName from '@/components/tag/tag-name';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import Tag from '@/types/response/Tag';

type TagCardProps = HTMLAttributes<HTMLSpanElement> & {
  tag: Tag;
  onDelete?: (tag: Tag) => void;
};

export default function TagCard({
  tag,
  className,
  onDelete,
  ...props
}: TagCardProps) {
  const { name, value, color } = tag;

  const hasDelete = !!onDelete;

  const handleOnDelete = (tag: Tag) => {
    if (onDelete) {
      onDelete(tag);
    }
  };

  return (
    <span
      className={cn(
        'flex items-center gap-0.5 cursor-pointer whitespace-nowrap rounded-full px-2 py-2 font-extralight text-center text-xs capitalize text-background dark:text-foreground',
        className,
      )}
      style={{ backgroundColor: color }}
      onClick={() => handleOnDelete(tag)}
      {...props}
    >
      <TagName>{name}</TagName>(<TagName>{value}</TagName>)
      {hasDelete && <XIcon className="size-4" />}
    </span>
  );
}
