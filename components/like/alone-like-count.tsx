import { LikeIcon } from '@/components/common/icons';

import { cn } from '@/lib/utils';

type Props = {
  like: number;
};

export default function AloneLikeCount({ like }: Props) {
  return (
    <span className={cn('flex gap-1 transition-colors items-center text-base')} title="like-count">
      <LikeIcon className="size-4" />
      {like}
    </span>
  );
}
