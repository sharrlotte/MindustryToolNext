import ComboBox from '@/components/common/combo-box';

import { useI18n } from '@/i18n/client';
import SortTag, { sortTagGroup } from '@/types/response/SortTag';

type SortDropdownProps = {
  sortBy: string;
  handleSortChange: (value?: string) => void;
};

export default function SortDropdown({ sortBy, handleSortChange }: SortDropdownProps) {
  const { t } = useI18n();

  return (
    <ComboBox
      className="h-full"
      value={{
        label: t(sortBy.toLowerCase().replaceAll('_', '-')),
        value: sortBy,
      }}
      values={sortTagGroup.values.map((value) => ({
        label: t(value.name.toLowerCase().replaceAll('_', '-')),
        value: value.name as SortTag,
      }))}
      onChange={handleSortChange}
      searchBar={false}
      required
    />
  );
}
