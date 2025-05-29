'use client';

import { ThumbsUp } from 'lucide-react';

import { useLike } from '@/components/like/like-component';
import { ButtonProps } from '@/components/ui/button';

import { cn } from '@/lib/utils';

type LikeButtonProps = Omit<ButtonProps, 'title'>;

export default function LikeButton({ className, ...props }: LikeButtonProps) {
	const { handleAction, data, isLoading, like } = useLike();

	return (
		<button
			className={cn(
				'flex h-9 min-w-9 gap-2 cursor-pointer text-lg hover:border-success items-center bg-secondary justify-center rounded-md border border-border px-2 hover:bg-success-foreground hover:text-background dark:hover:text-foreground',
				className,
				{
					'bg-success-foreground text-brand-foreground': data?.state === 1,
				},
			)}
			title="like"
			{...props}
			disabled={isLoading}
			onClick={() => handleAction('LIKE')}
		>
			<ThumbsUp className="size-5" />
			{like}
		</button>
	);
}
