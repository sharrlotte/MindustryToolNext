import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';

import { User } from '@/query/user';

import { cn } from '@/lib/utils';

type Props = {
	className?: string;
	user: User;
};

export function MemberCard({ className, user }: Props) {
	return (
		<div className={cn('w-full items-center text-wrap rounded-lg flex p-2 gap-2', className)}>
			<UserAvatar user={user} url />
			<ColorAsRole className="font-semibold capitalize" roles={user.roles}>
				{user.name}
			</ColorAsRole>
		</div>
	);
}
