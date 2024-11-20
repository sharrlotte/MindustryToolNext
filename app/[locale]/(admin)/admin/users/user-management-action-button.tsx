import React from 'react';

import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import { EllipsisButton } from '@/components/ui/ellipsis-button';

import { User } from '@/types/response/User';

type UserManagementActionButtonProps = {
  user: User;
};

export default function UserManagementActionButton({ user: { id } }: UserManagementActionButtonProps) {
  return (
    <EllipsisButton variant="icon">
      <InternalLink href={`admin/users/notifications?userId=${id}`} variant="command">
        <Tran text="notification.send-notification" />
      </InternalLink>
    </EllipsisButton>
  );
}
