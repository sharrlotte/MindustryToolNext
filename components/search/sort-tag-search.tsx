import ComboBox from '@/components/common/combo-box';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { defaultSortTag } from '@/constant/env';
import useQueryState from '@/hooks/use-query-state';
import { sortTagGroup } from '@/types/response/SortTag';
import React from 'react';

export default function SortTagSearch() {
  const [selectedSortTag, setSelectedSortTag] = useQueryState(
    'sort',
    defaultSortTag,
  );

  const sortTags = sortTagGroup.value.map((value) => ({
    label: value,
    value: value,
  }));

  return (
    <ComboBox
      value={{ label: selectedSortTag, value: selectedSortTag }}
      values={sortTags}
      onChange={setSelectedSortTag}
    />
  );
}
