import { UserActions } from '@/app/[locale]/user-sheet';

import LoginButton from '@/components/button/login-button';
import LogoutButton from '@/components/button/logout-button';
import { LogoutIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Divider from '@/components/ui/divider';
import UserAvatar from '@/components/user/user-avatar';
import UserRoleCard from '@/components/user/user-role';

import { getSession } from '@/action/action';
import { isError } from '@/lib/utils';

export function UserDisplay() {
  return (
    <div className="space-y-0.5 mt-auto">
      <Divider />
      <UserActions />
      <Internal />
    </div>
  );
}
export async function Internal() {
  const session = await getSession();

  if (isError(session)) {
    return undefined;
  }

  if (session) {
    return (
      <AlertDialog>
        <div className="flex h-16 items-center justify-between rounded-sm bg-card p-1">
          <div className="flex items-center justify-center gap-1">
            <UserAvatar className="h-12 w-12" user={session} url="/users/@me" />
            <div className="grid p-1">
              <span className="capitalize">{session.name}</span>
              <UserRoleCard roles={session.roles} />
            </div>
          </div>
          <div className="cursor-pointer justify-start pr-1">
            <AlertDialogTrigger>
              <LogoutIcon />
            </AlertDialogTrigger>
          </div>
        </div>
        <AlertDialogContent>
          <AlertDialogTitle className="font-semibold">
            <Tran text="logout" />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            <Tran text="logout-confirm" />
          </AlertDialogDescription>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel className="min-w-20">
              <Tran text="cancel" />
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <LogoutButton className="justify-center gap-1 pr-2" />
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return <LoginButton className="w-full justify-start gap-1" />;
}
