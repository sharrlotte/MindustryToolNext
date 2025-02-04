'use client';

import { DislikeIcon } from '@/components/common/icons';
import { useLike } from '@/components/like/like-component';
import { ButtonProps } from '@/components/ui/button';

import { cn } from '@/lib/utils';

type LikeButtonProps = Omit<ButtonProps, 'title'>;

export default function DislikeButton({ className, ...props }: LikeButtonProps) {
  const { handleAction, likeData, isLoading, dislike } = useLike();

  return (
    <button
      className={cn(
        'flex h-9 min-w-9 gap-2 text-lg items-center hover:border-destructive bg-secondary justify-center rounded-md overflow-hidden border-border border p-2 hover:bg-destructive hover:text-background dark:hover:text-foreground',
        className,
        {
          'bg-destructive text-brand-foreground': likeData?.state === -1,
        },
      )}
      {...props}
      title={'dislike'}
      disabled={isLoading}
      onClick={() => handleAction('DISLIKE')}
    >
      <DislikeIcon className="size-5" />
      {dislike}
    </button>
  );
}
