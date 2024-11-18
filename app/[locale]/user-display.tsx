import { LogOut } from 'lucide-react';

import { UserActions } from '@/app/[locale]/user-sheet';
import LoginButton from '@/components/button/login-button';
import LogoutButton from '@/components/button/logout-button';
import Divider from '@/components/ui/divider';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user/user-avatar';
import UserRoleCard from '@/components/user/user-role';
import env from '@/constant/env';
import { useSession } from '@/context/session-context.client';
import useToggle from '@/hooks/use-state-toggle';
import Modal from '@/layout/modal';

export function UserDisplay() {
  return (
    <div className="space-y-2">
      <Divider />
      <UserActions />
      <Internal />
    </div>
  );
}
export function Internal() {
  const { session, state } = useSession();
  const modal = useToggle();

  if (state === 'authenticated' && session) {
    return (
      <>
        <div className="flex h-16 items-center justify-between rounded-sm bg-card p-1">
          <div className="flex items-center justify-center gap-1">
            <UserAvatar className="h-12 w-12" user={session} url="/users/@me" />
            <div className="grid p-1">
              <span className="capitalize">{session.name}</span>
              <UserRoleCard roles={session.roles} />
            </div>
          </div>
          <div className="cursor-pointer justify-start pr-1" onClick={modal.toggle}>
            <LogOut className="size-5" />
          </div>
        </div>
        <Modal isOpen={modal.isOpen} onClose={modal.close}>
          <div className="flex w-full flex-col gap-2 py-2">
            <p className="font-semibold">Are you sure you want to log out?</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="rounded border px-2 py-1 transition-colors" onClick={modal.toggle}>
                Cancel
              </button>
              <a className='flex border justify-center items-center px-2 py-1 rounded-md' href={`${env.url.api}/auth/logout`}>
                <LogoutButton className="justify-start pr-1" />
                <span>Log out</span>
              </a>
            </div>
          </div>
        </Modal>
        {
          //#endregion
        }
      </>
    );
  }

  if (state === 'loading') {
    return <Skeleton className="flex h-16 max-h-16 flex-1 items-center justify-between rounded-sm bg-card p-1" />;
  }

  return <LoginButton className="w-full justify-start gap-1" />;
}
