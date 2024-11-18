import { ThumbsUpIcon } from 'lucide-react';

import { useLike } from '@/context/like-context';
import { cn } from '@/lib/utils';

export default function AloneLikeCount() {
  const { count } = useLike();

  return (
    <button
      className={cn('flex h-9 min-w-9 gap-2 transition-colors items-center justify-center rounded-md border border-border text-base hover:bg-accent', {
        'text-destructive hover:text-destructive': count < 0,
        'text-success hover:text-success': count > 0,
      })}
      title="like-count"
    >
      <ThumbsUpIcon className="size-[1.25rem]" />
      <span>{count}</span>
    </button>
  );
}
