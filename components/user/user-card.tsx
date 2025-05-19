import React from 'react';

import InternalLink from '@/components/common/internal-link';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';

import { User } from '@/types/response/User';

type UserCardProps = {
	avatar?: boolean;
	user: Omit<User, 'authorities'> | null;
};
function UserCard({ user, avatar }: UserCardProps) {
	if (!user) {
		return;
	}

	const { name, roles } = user;

	return (
		<div className="flex items-center gap-2 overflow-hidden">
			{avatar && <UserAvatar user={user} url />}
			<InternalLink className="cursor-pointer hover:underline" href={`/users/${user.id}`}>
				<ColorAsRole className="font-semibold capitalize" roles={roles}>
					{name}
				</ColorAsRole>
			</InternalLink>
		</div>
	);
}

export default UserCard;
