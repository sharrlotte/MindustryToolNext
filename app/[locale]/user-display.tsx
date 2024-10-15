import { UserActions } from '@/app/[locale]/user-sheet';
import LoginButton from '@/components/button/login-button';
import LogoutButton from '@/components/button/logout-button';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user/user-avatar';
import UserRoleCard from '@/components/user/user-role';
import { useSession } from '@/context/session-context.client';
import { useI18n } from '@/i18n/client';

export function UserDisplay() {
  return (
    <div className="space-y-2">
      <UserActions />
      <Internal />
    </div>
  );
}
export function Internal() {
  const { session, state } = useSession();
  const t = useI18n();

  if (state === 'authenticated' && session) {
    return (
      <div className="flex h-16 items-center justify-between rounded-sm bg-card p-1">
        <div className="flex items-center justify-center gap-1">
          <UserAvatar className="h-12 w-12" user={session} url="/users/@me" />
          <div className="grid p-1">
            <span className="capitalize">{session.name}</span>
            <UserRoleCard roles={session.roles} />
          </div>
        </div>
        <LogoutButton className="justify-start pr-1" />
      </div>
    );
  }

  if (state === 'loading') {
    return <Skeleton className="flex h-16 max-h-16 flex-1 items-center justify-between rounded-sm bg-card p-1" />;
  }

  return <LoginButton className="w-full justify-start gap-1" />;
}
