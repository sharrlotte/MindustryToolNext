import { cn } from '@/lib/utils';
import { useSearchBarVisibility } from '@/zustand/auto-hide-search-store';

type Dir = 'width' | 'height';

type Props = {
  className?: string;
  dir: Dir;
  children: React.ReactNode;
};

export function ShowOnScroll({ className, children }: Props) {
  const { visible } = useSearchBarVisibility();

  return (
    <div
      className={cn(
        'overflow-hidden h-fit',
        {
          visible: visible,
          hidden: !visible,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
