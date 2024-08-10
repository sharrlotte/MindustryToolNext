'use client';

import { ButtonProps } from '@/components/ui/button';
import { useLike } from '@/context/like-context';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';

type LikeButtonProps = Omit<ButtonProps, 'title'>;

export default function LikeCount({ className, ...props }: LikeButtonProps) {
  const { likeData } = useLike();
  const { count } = likeData;
  const t = useI18n();

  return (
    <button
      className={cn(
        'flex h-9 min-w-9 items-center justify-center rounded-md border border-border text-xl hover:bg-accent',
        className,
        {
          'text-destructive hover:text-destructive': count < 0,
          'text-success hover:text-success': count > 0,
        },
      )}
      size="icon"
      variant="outline"
      title={t('like-count')}
      {...props}
    >
      {count}
    </button>
  );
}
