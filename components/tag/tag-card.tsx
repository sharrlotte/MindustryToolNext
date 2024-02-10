import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Tag from '@/types/response/Tag';
import { XMarkIcon } from '@heroicons/react/24/solid';
import React, { HTMLAttributes } from 'react';

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
  const hasDeleteButton = onDelete ? true : false;
  const { name, value, color } = tag;

  const handleOnDelete = (tag: Tag) => {
    if (onDelete) {
      onDelete(tag);
    }
  };

  return (
    <span
      className={cn(
        'py-1/2 group flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-md px-1 text-center text-xs capitalize',
        className,
      )}
      style={{ backgroundColor: color }}
      {...props}
    >
      <span>{`${name}(${value})`}</span>
      {hasDeleteButton && (
        <Button
          className="max-w-0 p-0 transition-all duration-500 group-hover:max-w-full"
          title="delete"
          variant="icon"
          onClick={() => handleOnDelete(tag)}
        >
          <XMarkIcon className="h-5 w-5" />
        </Button>
      )}
    </span>
  );
}
