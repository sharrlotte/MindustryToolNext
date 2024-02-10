'use client';

import { ButtonProps } from '@/components/ui/button';
import { useLike } from '@/context/like-context';
import { cn } from '@/lib/utils';
import { ChevronDoubleUpIcon } from '@heroicons/react/24/solid';

type LikeButtonProps = Omit<ButtonProps, 'title'>;

export default function LikeButton({ className, ...props }: LikeButtonProps) {
  const { handleLike, likeData, isLoading } = useLike();

  return (
    <button
      className={cn(
        'flex h-9 min-w-9 items-center justify-center rounded-md border border-border p-2 hover:bg-success',
        className,
        {
          'bg-success hover:bg-success': likeData?.state === 1,
        },
      )}
      title="like"
      size="icon"
      variant="outline"
      {...props}
      disabled={isLoading}
      onClick={handleLike}
    >
      <ChevronDoubleUpIcon className="h-6 w-6" />
    </button>
  );
}
