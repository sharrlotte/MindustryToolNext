import { XIcon } from 'lucide-react';
import React, { HTMLAttributes } from 'react';

import TagName from '@/components/tag/tag-name';
import { cn } from '@/lib/utils';
import Tag from '@/types/response/Tag';
import Tran from '@/components/common/tran';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
        'flex cursor-pointer items-center gap-0.5 whitespace-nowrap rounded-full px-2 py-2 text-center text-xs font-extralight text-background dark:text-foreground',
        className,
      )}
      style={{ backgroundColor: color }}
      onClick={() => handleOnDelete(tag)}
      {...props}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <TagName>{name}</TagName>(<TagName>{value}</TagName>)
          </TooltipTrigger>
          <TooltipContent className="bg-foreground normal-case text-background">
            <Tran text={`tag.${name}.${value}.description`} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {hasDelete && <XIcon className="size-4" />}
    </span>
  );
}
