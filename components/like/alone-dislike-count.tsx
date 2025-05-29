import { ThumbsDown } from 'lucide-react';

import { cn } from '@/lib/utils';

type Props = {
	dislike: number;
};
export default function AloneDislikeCount({ dislike }: Props) {
	return (
		<span className={cn('flex gap-1 transition-colors items-center text-base')} title="dislike-count">
			<ThumbsDown className="size-4" />
			{dislike}
		</span>
	);
}
