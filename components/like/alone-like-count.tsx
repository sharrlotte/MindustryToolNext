import { LikeIcon } from '@/components/common/icons';

import { cn } from '@/lib/utils';

type Props = {
  like: number;
};

export default function AloneLikeCount({ like }: Props) {
  return (
    <div className={cn('flex h-9 min-w-9 gap-2 transition-colors items-center justify-center rounded-md border border-border text-lg')} title="like-count">
      <LikeIcon className="size-[1.25rem]" />
      {like}
    </div>
  );
}
