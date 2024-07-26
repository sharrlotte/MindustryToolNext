'use client';

import { ThumbsDownIcon } from 'lucide-react';

import { ButtonProps } from '@/components/ui/button';
import { useLike } from '@/context/like-context';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';

import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline';

type LikeButtonProps = Omit<ButtonProps, 'title'>;

export default function DislikeButton({
  className,
  ...props
}: LikeButtonProps) {
  const { handleAction, likeData, isLoading } = useLike();
  const t = useI18n();

  return (
    <button
      className={cn(
        'flex h-9 min-w-9 items-center justify-center rounded-md border border-border p-2 hover:bg-destructive hover:text-background dark:hover:text-foreground',
        className,
        {
          'bg-destructive text-background dark:text-foreground':
            likeData?.state === -1,
        },
      )}
      size="icon"
      variant="outline"
      {...props}
      title={t('dislike')}
      disabled={isLoading}
      onClick={() => handleAction('DISLIKE')}
    >
      <ThumbsDownIcon className="h-5 w-5" />
    </button>
  );
}
