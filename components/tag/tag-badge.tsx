import React, { HTMLAttributes, useCallback } from 'react';

import { XIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { TagName } from '@/components/tag/tag-name';
import TagTooltip from '@/components/tag/tag-tooltip';

import { cn } from '@/lib/utils';
import Tag from '@/types/response/Tag';

type TagBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tag: Tag;
  onDelete?: (tag: Tag) => void;
};

export default TagBadge;

function TagBadge({ tag, className, onDelete, ...props }: TagBadgeProps) {
  const { name, value, icon, color } = tag;

  const hasDelete = !!onDelete;

  const handleOnDelete = useCallback((tag: Tag) => {
    if (onDelete) onDelete(tag);
  }, []);

  return (
    <span
      className={cn('flex cursor-pointer items-center gap-0.5 flex-nowrap whitespace-nowrap rounded-full px-2 py-1 text-center text-xs text-brand-foreground group', className)}
      style={{ backgroundColor: color }}
      onClick={() => handleOnDelete(tag)}
      {...props}
    >
      <TagTooltip value={value}>
        <TagName icon={icon}>
          <Tran text={`tags.${name}`} />
        </TagName>
        (
        <TagName>
          <Tran text={`tags.${value}`} />
        </TagName>
        )
      </TagTooltip>
      {hasDelete && <XIcon className="size-4 group-hover:block group-focus:block hidden" />}
    </span>
  );
}
