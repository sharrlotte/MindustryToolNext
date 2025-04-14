import React, { Suspense } from 'react';

import { ChangeRoleDialog } from '@/app/[locale]/(main)/admin/setting/(users)/change-role-dialog';
import UserManagementActionButton from '@/app/[locale]/(main)/admin/setting/(users)/user-management-action-button';

import CopyButton from '@/components/button/copy-button';
import UserAvatar from '@/components/user/user-avatar';

import { User } from '@/types/response/User';

type Props = {
	user: User;
};

export function UserManagementCard({ user }: Props) {
	return (
		<div className="grid w-full grid-cols-[1fr_10rem_auto] gap-4 bg-card px-4 py-2 rounded- items-center rounded-md overflow-hidden">
			<div className="flex justify-between space-x-2 overflow- items-center overflow-hidden">
				<UserAvatar user={user} url />
				<CopyButton className="w-full justify-start overflow-hidden hover:bg-transparent bg-transparent border-transparent" data={user.id} content={user.id}>
					<h3>{user.name}</h3>
				</CopyButton>
			</div>
			<Suspense>
				<ChangeRoleDialog user={user} />
			</Suspense>
			<Suspense>
				<UserManagementActionButton user={user} />
			</Suspense>
		</div>
	);
}
