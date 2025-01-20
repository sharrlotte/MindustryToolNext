import React, { useCallback, useMemo } from 'react';



import MultipleFilerTags from '@/components/tag/multiple-filter-tags';
import SingeFilerTags from '@/components/tag/single-filter-tags';



import TagGroup from '@/types/response/TagGroup';


export type FilterTag = { name: string; icon?: string };

type FilterTagProps = {
  filter: string;
  filterBy: TagGroup[];
  tags: TagGroup[];
  handleTagGroupChange: (group: string, value: FilterTag[]) => void;
};

const empty: FilterTag[] = [];

export default function FilterTags({ filter, tags, filterBy, handleTagGroupChange }: FilterTagProps) {
  const filteredTags = useMemo(
    () =>
      filter.length === 0
        ? tags
        : tags
            .map((tag) => {
              const v = { ...tag };
              v.values = tag.values.filter((value) => value.name.toLowerCase().includes(filter.toLowerCase()));

              return v;
            })
            .filter((tag) => tag.values.length > 0),
    [filter, tags],
  );

  return filteredTags.map((group) => <FilterTagGroup key={group.name} selectedGroup={filterBy.find((value) => value.name === group.name)} group={group} handleTagGroupChange={handleTagGroupChange} />);
}

type FilterTagGroupProps = {
  group: TagGroup;
  selectedGroup?: TagGroup;
  handleTagGroupChange: (group: string, value: FilterTag[]) => void;
};

const FilterTagGroup = ({ group, selectedGroup, handleTagGroupChange }: FilterTagGroupProps) => {
  const handleMultipleValueChange = useCallback((value: FilterTag[]) => handleTagGroupChange(group.name, value), [group, handleTagGroupChange]);

  const handleSingleValueChange = useCallback((value: FilterTag) => handleTagGroupChange(group.name, value ? [value] : []), [group, handleTagGroupChange]);

  return group.duplicate ? (
    <MultipleFilerTags key={group.name} group={group} selectedValue={selectedGroup?.values ?? empty} handleTagGroupChange={handleMultipleValueChange} />
  ) : (
    <SingeFilerTags key={group.name} group={group} selectedValue={selectedGroup?.values[0]} handleTagGroupChange={handleSingleValueChange} />
  );
};
