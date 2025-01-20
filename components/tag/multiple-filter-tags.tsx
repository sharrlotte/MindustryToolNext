import React from 'react';

import Tran from '@/components/common/tran';
import { TagName } from '@/components/tag/tag-name';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';
import TagGroup from '@/types/response/TagGroup';

type MultipleFilerTagsProps = {
  group: TagGroup;
  selectedValue: string[];
  handleTagGroupChange: (value: string[]) => void;
};

export default function MultipleFilerTags({ group, selectedValue, handleTagGroupChange }: MultipleFilerTagsProps) {
  const handleClick = (value: string) => {
    const index = selectedValue.indexOf(value);
    if (index === -1) {
      handleTagGroupChange([...selectedValue, value]);
    } else {
      handleTagGroupChange([...selectedValue.slice(0, index), ...selectedValue.slice(index + 1)]);
    }
  };

  return (
    <div className="flex w-full flex-wrap justify-start py-2 gap-1">
      <TagName className="whitespace-nowrap text-lg capitalize" value={group.name}>
        <Tran text={`tags.${group.name}`} />
      </TagName>
      <Separator className="border-[1px]" orientation="horizontal" />
      {group.values.map((value) => (
        <button
          className={cn('capitalize hover:bg-brand hover:text-brand-foreground data-[state=on]:bg-brand data-[state=on]:text-brand-foreground p-2 rounded-lg', { 'bg-brand text-brand-foreground': selectedValue.includes(value) })}
          key={value}
          onClick={() => handleClick(value)}
        >
          <TagName value={value}>
            <Tran text={`tags.${value}`} />
          </TagName>
        </button>
      ))}
    </div>
  );
}
