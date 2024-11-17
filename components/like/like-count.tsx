'use client';

import { ButtonProps } from '@/components/ui/button';
import { useLike } from '@/context/like-context';
import { cn } from '@/lib/utils';

type LikeButtonProps = Omit<ButtonProps, 'title'>;

export default function LikeCount({ className, ...props }: LikeButtonProps) {
  const { likeData } = useLike();
  const { count } = likeData;

  return (
    <button
      className={cn('flex h-9 min-w-9 transition-colors items-center justify-center rounded-md border border-border text-xl hover:bg-accent', className, {
        'text-destructive hover:text-destructive': count < 0,
        'text-success hover:text-success': count > 0,
      })}
      size="icon"
      variant="outline"
      title="like-count"
      {...props}
    >
      {count}
    </button>
  );
}
