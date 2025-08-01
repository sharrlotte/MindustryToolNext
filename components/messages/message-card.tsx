import ColorText from '@/components/common/color-text';
import { RelativeTime } from '@/components/common/relative-time';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';

import useUser from '@/hooks/use-user';
import { cn } from '@/lib/utils';
import { MessageGroup } from '@/types/response/Message';

type Props = {
	className?: string;
	message: MessageGroup;
};

export function MessageCard({ className, message }: Props) {
	const { userId, contents, createdAt } = message;

	const { data } = useUser(userId);

	return (
		<div className={cn('flex gap-2 p-2 w-full text-base text-wrap hover:bg-secondary/50', className)}>
			{data ? (
				<UserAvatar url={`/users/${userId}`} user={data} />
			) : (
				<Skeleton className="flex justify-center items-center capitalize rounded-full border size-8 min-h-8 min-w-8 border-border" />
			)}
			<div className="overflow-hidden">
				<div className="flex gap-2 items-center">
					{data ? (
						<ColorAsRole className="capitalize" roles={data.roles}>
							{data.name}
						</ColorAsRole>
					) : (
						<Skeleton className="w-24 h-4 max-h-4" />
					)}
					<RelativeTime className="text-muted-foreground text-sm" date={new Date(createdAt)} />
				</div>
				<div className="grid overflow-hidden w-full no-scrollbar">
					<TooltipProvider>
						{contents.map(({ text, createdAt }, index) => (
							<Tooltip key={index}>
								<TooltipTrigger className="flex justify-start items-start p-0 cursor-default pointer-events-auto select-text text-start w-fit">
									<ColorText className="overflow-hidden break-words" text={text} />
								</TooltipTrigger>
								<TooltipContent>{new Date(createdAt).toLocaleString()}</TooltipContent>
							</Tooltip>
						))}
					</TooltipProvider>
				</div>
			</div>
		</div>
	);
}

export function MessageCardSkeleton() {
	return (
		<div className="flex gap-2 p-2 w-full h-16 text-base rounded-lg text-wrap">
			<Skeleton className="flex justify-center items-center capitalize rounded-full border size-8 min-h-8 min-w-8 border-border" />
			<div className="overflow-hidden">
				<div className="flex gap-2">
					<Skeleton className="w-24 h-4 max-h-4" />
				</div>
				<div className="grid overflow-hidden gap-1 w-full no-scrollbar">
					<Skeleton className="w-full h-6 rounded-md" />
				</div>
			</div>
		</div>
	);
}
