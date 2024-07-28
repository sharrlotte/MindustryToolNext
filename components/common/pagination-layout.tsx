import { LayoutGridIcon, ListIcon } from 'lucide-react';
import { ReactNode } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePaginationType } from '@/zustand/pagination-type';

type Props = {
  grid: ReactNode;
  list: ReactNode;
};

export default function PaginationLayout({ grid, list }: Props) {
  const { type, setType } = usePaginationType();

  return (
    <div className="flex gap-2 flex-col h-full overflow-hidden">
      <div className="flex justify-end">
        <ToggleGroup value={type} type="single" onValueChange={setType}>
          <ToggleGroupItem
            className="data-[state=on]:bg-secondary"
            value="grid"
          >
            <LayoutGridIcon className="size-5" />
          </ToggleGroupItem>
          <ToggleGroupItem
            className="data-[state=on]:bg-secondary"
            value="infinite-list"
          >
            <ListIcon className="size-5" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {type === 'grid' ? grid : list}
    </div>
  );
}
