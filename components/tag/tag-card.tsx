import React, { HTMLAttributes } from 'react';

import { Button } from '@/components/ui/button';
import Tag from '@/types/response/Tag';
import TagName from '@/components/tag/tag-name';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';

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
  const hasDeleteButton = onDelete !== undefined;
  const { name, value, color } = tag;

  const handleOnDelete = (tag: Tag) => {
    if (onDelete) {
      onDelete(tag);
    }
  };

  const t = useI18n();

  return (
    <span
      className={cn(
        'py-1/2 flex h-8 items-center gap-1 whitespace-nowrap rounded-md px-1 text-center text-xs capitalize text-background dark:text-foreground',
        className,
        {
          group: hasDeleteButton,
        },
      )}
      style={{ backgroundColor: color }}
      {...props}
    >
      <TagName>{name}</TagName>(<TagName>{value}</TagName>)
      {hasDeleteButton && (
        <Button
          className="w-0 p-0 transition-all duration-500 group-hover:w-full"
          title={t('delete')}
          variant="icon"
          onClick={() => handleOnDelete(tag)}
        >
          <XMarkIcon className="h-5 w-5" />
        </Button>
      )}
    </span>
  );
}
