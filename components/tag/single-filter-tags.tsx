import React from 'react';

import { TagName } from '@/components/tag/tag-name';
import { Separator } from '@/components/ui/separator';

import { ContextTagGroup } from '@/context/tags-context';
import { cn } from '@/lib/utils';

type SingeFilerTagsProps = {
  group: ContextTagGroup;
  selectedValue: string;
  handleTagGroupChange: (value: string) => void;
};

function SingeFilerTags({ group, selectedValue, handleTagGroupChange }: SingeFilerTagsProps) {
  return (
    <div className="flex w-full flex-wrap justify-start py-2 gap-1">
      <TagName className="whitespace-nowrap text-lg capitalize" value={group.name}>{group.displayName}</TagName>
      <Separator className="border-[1px]" orientation="horizontal" />
      {group.values.map(({ value, display }) => (
          <button className={cn("capitalize hover:bg-brand hover:text-brand-foreground data-[state=on]:bg-brand data-[state=on]:text-brand-foreground p-2 rounded-lg", {"bg-brand text-brand-foreground": value === selectedValue})} key={value} onClick={() => handleTagGroupChange(value)}>
            <TagName value={value}>{display}</TagName>
          </button>
      ))}
    </div>
  );
}

export default SingeFilerTags;
