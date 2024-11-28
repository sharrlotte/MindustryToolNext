import React from 'react';

import { TagName } from '@/components/tag/tag-name';
import TagTooltip from '@/components/tag/tag-tooltip';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { ContextTagGroup } from '@/context/tags-context';

type MultipleFilerTagsProps = {
  group: ContextTagGroup;
  selectedValue: string[];
  handleTagGroupChange: (value: string[]) => void;
};

export default function MultipleFilerTags({ group, selectedValue, handleTagGroupChange }: MultipleFilerTagsProps) {
  return (
    <ToggleGroup className="flex w-full flex-wrap justify-start" type={'multiple'} onValueChange={handleTagGroupChange} value={selectedValue}>
      <TagName className="whitespace-nowrap text-lg capitalize" value={group.name}>
        {group.displayName}
      </TagName>
      <Separator className="border-[1px]" orientation="horizontal" />
      {group.values.map(({ value, display }) => (
        <TagTooltip value={value} key={value}>
          <ToggleGroupItem className="capitalize hover:bg-brand hover:text-background data-[state=on]:bg-brand data-[state=on]:text-background dark:hover:text-foreground data-[state=on]:dark:text-foreground" key={value} value={value}>
            <TagName value={value}>{display}</TagName>
          </ToggleGroupItem>
        </TagTooltip>
      ))}
    </ToggleGroup>
  );
}
