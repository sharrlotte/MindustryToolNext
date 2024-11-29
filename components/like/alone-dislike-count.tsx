import { DislikeIcon } from '@/components/common/icons';

import { useLike } from '@/context/like-context';
import { cn } from '@/lib/utils';

export default function AloneDislikeCount() {
  const { dislike } = useLike();

  return (
    <div className={cn('flex h-9 min-w-9 gap-2 transition-colors items-center justify-center rounded-md border border-border text-base')} title="dislike-count">
      <DislikeIcon className="size-[1.25rem]" />
      <span
        className={cn('font-semibold text-lg', {
          'text-destructive hover:text-destructive': dislike < 0,
          'text-success hover:text-success': dislike > 0,
        })}
      >
        {dislike}
      </span>
    </div>
  );
}
