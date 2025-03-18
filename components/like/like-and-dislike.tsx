import { DislikeIcon, LikeIcon } from '@/components/common/icons';

import { cn } from '@/lib/utils';

type Props = {
  like: number;
  dislike: number;
};
export default function LikeAndDislike({ like, dislike }: Props) {
  return (
    <div className="flex gap-2 text-muted-foreground items-center font-thin">
      <span className={cn('flex gap-2 transition-colors items-center text-lg')} title="like-count">
        <LikeIcon className="size-5 text-success" />
        {like}
      </span>
      |
      <span className={cn('flex gap-2 transition-colors items-center text-lg')} title="dislike-count">
        <DislikeIcon className="size-[19px] text-destructive" />
        {dislike}
      </span>
    </div>
  );
}
