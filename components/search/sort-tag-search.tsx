import React from 'react';

import ComboBox from '@/components/common/combo-box';
import { defaultSortTag } from '@/constant/env';
import useQueryState from '@/hooks/use-query-state';
import SortTag, { sortTagGroup } from '@/types/response/SortTag';

export default function SortTagSearch() {
  const [selectedSortTag, setSelectedSortTag] = useQueryState<SortTag>(
    'sort',
    defaultSortTag,
  );

  const sortTags = sortTagGroup.values.map((value) => ({
    label: value,
    value: value as SortTag,
  }));

  return (
    <ComboBox<SortTag>
      value={{ label: selectedSortTag, value: selectedSortTag }}
      values={sortTags}
      onChange={setSelectedSortTag}
    />
  );
}
