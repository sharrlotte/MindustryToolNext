import React, { useCallback, useMemo } from 'react';

import MultipleFilerTags from '@/components/tag/multiple-filter-tags';
import SingeFilerTags from '@/components/tag/single-filter-tags';
import TagGroup from '@/types/response/TagGroup';

type FilterTagProps = {
  filter: string;
  filterBy: TagGroup[];
  tags: TagGroup[];
  handleTagGroupChange: (group: string, value: string[]) => void;
};

const empty: string[] = [];

export default function FilterTags({
  filter,
  tags,
  filterBy,
  handleTagGroupChange,
}: FilterTagProps) {
  const filteredTags = useMemo(
    () =>
      filter.length === 0
        ? tags
        : tags.filter((tag) => {
            if (tag.name.includes(filter)) {
              return true;
            }
            const v = { ...tag };
            v.values = tag.values.filter((value) => value.includes(filter));

            return v.values.length > 0;
          }),
    [filter, tags],
  );

  return filteredTags.map((group) => (
    <FilterTagGroup
      key={group.name}
      selectedGroup={filterBy.find((value) => value.name === group.name)}
      group={group}
      handleTagGroupChange={handleTagGroupChange}
    />
  ));
}

type FilterTagGroupProps = {
  group: TagGroup;
  selectedGroup?: TagGroup;
  handleTagGroupChange: (group: string, value: string[]) => void;
};

const InternalFilterTagGroup = ({
  group,
  selectedGroup,
  handleTagGroupChange,
}: FilterTagGroupProps) => {
  const handleMultipleValueChange = useCallback(
    (value: string[]) => handleTagGroupChange(group.name, value),
    [group, handleTagGroupChange],
  );

  const handleSingleValueChange = useCallback(
    (value: string) => handleTagGroupChange(group.name, [value]),
    [group, handleTagGroupChange],
  );

  return group.duplicate ? (
    <MultipleFilerTags
      key={group.name}
      group={group}
      selectedValue={selectedGroup?.values ?? empty}
      handleTagGroupChange={handleMultipleValueChange}
    />
  ) : (
    <SingeFilerTags
      key={group.name}
      group={group}
      selectedValue={selectedGroup?.values[0] ?? ''}
      handleTagGroupChange={handleSingleValueChange}
    />
  );
};

const FilterTagGroup = React.memo(InternalFilterTagGroup);
