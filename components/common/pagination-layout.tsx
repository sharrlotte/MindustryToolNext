import { LayoutGridIcon, ListIcon } from 'lucide-react';
import { ReactNode } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePaginationType } from '@/zustand/pagination-type';

type Props = {
  grid: ReactNode;
  list: ReactNode;
};

export function PaginationLayoutSwitcher() {
  const { type, setType } = usePaginationType();

  return (
    <ToggleGroup value={type} type="single" onValueChange={setType}>
      <ToggleGroupItem className="data-[state=on]:bg-secondary" value="grid">
        <LayoutGridIcon className="size-5" />
      </ToggleGroupItem>
      <ToggleGroupItem
        className="data-[state=on]:bg-secondary"
        value="infinite-list"
      >
        <ListIcon className="size-5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function PaginationLayout({ grid, list }: Props) {
  const { type } = usePaginationType();

  return type === 'grid' ? grid : list;
}
