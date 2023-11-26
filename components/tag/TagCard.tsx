import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Tag from "@/types/Tag";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { HTMLAttributes } from "react";

type TagCardProps = HTMLAttributes<HTMLSpanElement> & {
  tag: Tag;
  onDelete?: () => void;
};

export default function TagCard({
  tag,
  className,
  onDelete,
  ...props
}: TagCardProps) {
  const hasDeleteButton = onDelete ? true : false;
  const { name, value, color } = tag;

  return (
    <span
      className={cn("rounded-md px-2 py-1 whitespace-nowrap flex justify-center items-center text-center capitalize", className)}
      {...props}
      style={{ backgroundColor: color }}
    >
      <span>{`${name}:${value}`}</span>
      {hasDeleteButton && (
        <Button title="delete" onClick={onDelete}>
          <XMarkIcon />
        </Button>
      )}
    </span>
  );
}
