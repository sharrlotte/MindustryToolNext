import React from 'react';

import CopyButton from '@/components/button/copy-button';
import UserAvatar from '@/components/user/user-avatar';
import { User } from '@/types/response/User';

import { ChangeRoleDialog } from '@/app/[locale]/(admin)/admin/users/change-role-dialog';

type Props = {
  user: User;
};

function _UserManagementCard({ user }: Props) {
  return (
    <div className="grid w-full grid-cols-[1fr_10rem] gap-2 bg-card px-4 py-2">
      <div className="flex justify-between space-x-2 overflow-hidden">
        <UserAvatar user={user} />
        <CopyButton className="w-full justify-start overflow-hidden hover:bg-transparent" data={user.id} variant="ghost" content={user.id}>
          <h3>{user.name}</h3>
        </CopyButton>
      </div>
      <ChangeRoleDialog user={user} />
    </div>
  );
}

export const UserManagementCard = React.memo(_UserManagementCard);
