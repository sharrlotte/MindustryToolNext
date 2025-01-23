import { DislikeIcon } from '@/components/common/icons';
import { useLike } from '@/components/like/like-component';

import { cn } from '@/lib/utils';

export default function AloneDislikeCount() {
  const { dislike } = useLike();

  return (
    <div className={cn('flex text-lg h-9 min-w-9 gap-2 transition-colors items-center justify-center rounded-md border border-border')} title="dislike-count">
      <DislikeIcon className="size-[1.25rem]" />
      {dislike}
    </div>
  );
}
