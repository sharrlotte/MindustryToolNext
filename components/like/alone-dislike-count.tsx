import { DislikeIcon } from '@/components/common/icons';

import { cn } from '@/lib/utils';

type Props = {
  dislike: number;
};
export default function AloneDislikeCount({ dislike }: Props) {
  return (
    <div className={cn('flex text-lg h-9 min-w-9 gap-2 transition-colors items-center justify-center rounded-md bg-secondary border border-border')} title="dislike-count">
      <DislikeIcon className="size-[1.25rem]" />
      {dislike}
    </div>
  );
}
