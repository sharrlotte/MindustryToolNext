'use client';

import { LikeIcon } from '@/components/common/icons';
import { useLike } from '@/components/like/like-component';
import { ButtonProps } from '@/components/ui/button';

import { cn } from '@/lib/utils';

type LikeButtonProps = Omit<ButtonProps, 'title'>;

export default function LikeButton({ className, ...props }: LikeButtonProps) {
  const { handleAction, likeData, isLoading, like } = useLike();

  return (
    <button
      className={cn('flex h-9 min-w-9 gap-2 text-lg hover:border-success items-center bg-secondary justify-center rounded-md border border-border px-2 hover:bg-success hover:text-background dark:hover:text-foreground', className, {
        'bg-success text-brand-foreground': likeData?.state === 1,
      })}
      title="like"
      {...props}
      disabled={isLoading}
      onClick={() => handleAction('LIKE')}
    >
      <LikeIcon className="size-5" />
      {like}
    </button>
  );
}
