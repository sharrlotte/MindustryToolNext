import { TagName } from '@/components/tag/tag-name';
import TagTooltip from '@/components/tag/tag-tooltip';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import TagGroup from '@/types/response/TagGroup';
import React from 'react';

type MultipleFilerTagsProps = {
  group: TagGroup;
  selectedValue: string[];
  handleTagGroupChange: (value: string[]) => void;
};

function _MultipleFilerTags({
  group,
  selectedValue,
  handleTagGroupChange,
}: MultipleFilerTagsProps) {
  return (
    <ToggleGroup
      className="flex w-full flex-wrap justify-start"
      type={'multiple'}
      onValueChange={handleTagGroupChange}
      value={selectedValue}
    >
      <TagName className="whitespace-nowrap text-lg capitalize">
        {group.name}
      </TagName>
      <Separator className="border-[1px]" orientation="horizontal" />
      {group.values.sort().map((value) => (
        <TagTooltip name={group.name} value={value} key={value}>
          <ToggleGroupItem
            className="capitalize hover:bg-brand hover:text-background data-[state=on]:bg-brand data-[state=on]:text-background dark:hover:text-foreground data-[state=on]:dark:text-foreground"
            key={value}
            value={value}
          >
            <TagName>{value}</TagName>
          </ToggleGroupItem>
        </TagTooltip>
      ))}
    </ToggleGroup>
  );
}

const MultipleFilerTags = React.memo(_MultipleFilerTags);
export default MultipleFilerTags;
