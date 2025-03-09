'use client';

import React from 'react';

import { Hidden } from '@/components/common/hidden';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { toast } from '@/components/ui/sonner';

import { useSession } from '@/context/session-context';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import ProtectedElement from '@/layout/protected-element';
import { banUser, unbanUser } from '@/query/user';
import { User } from '@/types/response/User';

import { useMutation } from '@tanstack/react-query';

type UserManagementActionButtonProps = {
  user: User;
};

export default function UserManagementActionButton({ user }: UserManagementActionButtonProps) {
  const { id } = user;
  const { session } = useSession();

  return (
    <EllipsisButton variant="ghost">
      <InternalLink href={`admin/setting/notifications?userId=${id}`} variant="command">
        <Tran text="notification.send-notification" />
      </InternalLink>
      <ProtectedElement session={session} filter={{ authority: 'EDIT_USER' }}>
        <BanDialog user={user} />
      </ProtectedElement>
    </EllipsisButton>
  );
}

type BanDialogProps = {
  user: User;
};
function BanDialog({ user }: BanDialogProps) {
  const { id, isBanned } = user;
  const axios = useClientApi();
  const { invalidateByKey } = useQueriesData();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      toast.promise(isBanned ? unbanUser(axios, id) : banUser(axios, id), {
        loading: <Tran text={isBanned ? 'user-management.unban-user' : 'user-management.ban-user'} />,
        success: isBanned ? <Tran text="user-management.user-unbanned" /> : <Tran text="user-management.user-banned" />,
        error: (error) => ({
          title: isBanned ? <Tran text="user-management.user-unban-failed" /> : <Tran text="user-management.user-ban-failed" />,
          description: error.description,
        }),
      }),
    onSettled() {
      invalidateByKey(['users']);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isPending} variant="command-destructive" size="command">
          <Tran text={isBanned ? 'user-management.unban-user' : 'user-management.ban-user'} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>
          <Tran text={isBanned ? 'user-management.unban-user-confirmation' : 'user-management.ban-user-confirmation'} />
        </AlertDialogTitle>
        <Hidden>
          <AlertDialogDescription />
        </Hidden>
        <AlertDialogAction variant="destructive" onClick={() => mutate()} disabled={isPending}>
          <Tran text={isBanned ? 'user-management.unban-user' : 'user-management.ban-user'} />
        </AlertDialogAction>
        <AlertDialogCancel>
          <Tran text="cancel" />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
