import { ReactNode } from 'react';

import { LayoutGridIcon, LayoutListIcon } from '@/components/common/icons';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { usePaginationType } from '@/zustand/pagination-type-store';

type Props = {
  children: ReactNode;
};

export function PaginationLayoutSwitcher() {
  const { type, setType } = usePaginationType();

  return (
    <ToggleGroup value={type} type="single" onValueChange={setType}>
      <ToggleGroupItem className="aspect-square" value="grid" title="grid">
        <LayoutGridIcon className="size-5" />
      </ToggleGroupItem>
      <ToggleGroupItem className="aspect-square" value="infinite-scroll" title="infinite scroll">
        <LayoutListIcon className="size-5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function ListLayout({ children }: Props) {
  const { type } = usePaginationType();

  return type === 'infinite-scroll' ? children : undefined;
}

export function GridLayout({ children }: Props) {
  const { type } = usePaginationType();

  return type === 'grid' ? children : undefined;
}
