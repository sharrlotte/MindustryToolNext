'use client';

import { useLike } from '@/context/like-context';
import { ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline';

type LikeButtonProps = Omit<ButtonProps, 'title'>;

export default function DislikeButton({
  className,
  ...props
}: LikeButtonProps) {
  const { handleDislike, likeData, isLoading } = useLike();
  return (
    <button
      className={cn(
        'flex h-9 min-w-9 items-center justify-center rounded-md border border-border p-2 hover:bg-destructive',
        className,
        {
          'bg-destructive hover:bg-destructive': likeData?.state === -1,
        },
      )}
      size="icon"
      variant="outline"
      {...props}
      title="dislike"
      disabled={isLoading}
      onClick={handleDislike}
    >
      <ChevronDoubleDownIcon className="h-6 w-6" />
    </button>
  );
}
