import React, { HTMLAttributes } from 'react';

import { XIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { TagName } from '@/components/tag/tag-name';
import TagTooltip from '@/components/tag/tag-tooltip';

import { cn } from '@/lib/utils';
import Tag from '@/types/response/Tag';

type TagCardProps = HTMLAttributes<HTMLSpanElement> & {
  tag: Tag;
  onDelete?: (tag: Tag) => void;
};

const TagCard = React.memo(InternalTagCard);

export default TagCard;

function InternalTagCard({ tag, className, onDelete, ...props }: TagCardProps) {
  const { name, value, color } = tag;

  const hasDelete = !!onDelete;

  const handleOnDelete = (tag: Tag) => {
    if (onDelete) onDelete(tag);
  };

  return (
    <span
      className={cn('flex cursor-pointer items-center gap-0.5 flex-nowrap whitespace-nowrap rounded-full px-2 py-2 text-center text-xs text-background dark:text-foreground', className)}
      style={{ backgroundColor: color }}
      onClick={() => handleOnDelete(tag)}
      {...props}
    >
      <TagTooltip value={value}>
        <TagName value={name}>
          <Tran text={`tags.${name}`} />
        </TagName>
        (
        <TagName value={value}>
          <Tran text={`tags.${value}`} />
        </TagName>
        )
      </TagTooltip>
      {hasDelete && <XIcon className="size-4" />}
    </span>
  );
}
