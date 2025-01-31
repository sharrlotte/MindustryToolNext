import React from 'react';

import Tran from '@/components/common/tran';
import { FilterTag } from '@/components/tag/filter-tags';
import { TagName } from '@/components/tag/tag-name';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';
import TagGroup from '@/types/response/TagGroup';

type SingeFilerTagsProps = {
  group: TagGroup;
  selectedValue?: FilterTag;
  handleTagGroupChange: (value: FilterTag) => void;
};

function SingeFilerTags({ group, selectedValue, handleTagGroupChange }: SingeFilerTagsProps) {
  return (
    <div className="flex w-full flex-wrap justify-start py-2 gap-1">
      <TagName className="whitespace-nowrap text-lg capitalize">
        <Tran text={`tags.${group.name}`} />
      </TagName>
      <Separator className="border-[1px]" orientation="horizontal" />
      {group.values.map((value) => (
        <button
          className={cn('capitalize hover:bg-brand hover:text-brand-foreground text-muted-foreground data-[state=on]:bg-brand data-[state=on]:text-brand-foreground p-2 rounded-lg', { 'bg-brand text-brand-foreground': value.name === selectedValue?.name })}
          key={value.name}
          onClick={() => handleTagGroupChange(value)}
        >
          <TagName>
            <Tran text={`tags.${value.name}`} />
          </TagName>
        </button>
      ))}
    </div>
  );
}

export default SingeFilerTags;
