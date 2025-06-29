import React from 'react';

import InternalLink from '@/components/common/internal-link';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';

import { User } from '@/query/user';

type UserCardProps = {
	avatar?: boolean;
	user: Pick<User, 'id' | 'name' | 'roles'> | null;
};
function UserCard({ user, avatar = true }: UserCardProps) {
	if (!user) {
		return;
	}

	const { name, roles } = user;

	return (
		<div className="flex items-center gap-2 overflow-hidden">
			{avatar && <UserAvatar user={user} url />}
			<InternalLink className="cursor-pointer" href={`/users/${user.id}`}>
				<ColorAsRole className="font-semibold capitalize hover:underline" roles={roles}>
					{name}
				</ColorAsRole>
			</InternalLink>
		</div>
	);
}

export default UserCard;
