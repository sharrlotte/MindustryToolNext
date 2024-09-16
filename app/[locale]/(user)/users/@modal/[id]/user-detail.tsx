import { EditIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import UserAvatar from '@/components/user/user-avatar';
import UserRoleCard from '@/components/user/user-role';
import { useSession } from '@/context/session-context';
import ProtectedElement from '@/layout/protected-element';
import { User } from '@/types/response/User';
import Image from 'next/image';
import React from 'react';

type Props = {
  user: User;
};

export default function UserDetail({ user }: Props) {
  const { session } = useSession();
  const { name, roles, stats, thumbnail } = user;
  const level = Math.floor(Math.sqrt(stats?.EXP ?? 0));

  const nextLevel = level + 1;
  const nextLevelExp = level * level;
  const progress = (stats?.EXP ?? 0) / nextLevelExp;

  const style = thumbnail ? { backgroundImage: thumbnail } : undefined;

  return (
    <div
      className="relative flex flex-col gap-2 rounded-md bg-card bg-cover bg-center p-2"
      style={style}
    >
      {thumbnail && (
        <Dialog>
          <DialogTrigger>
            <Image
              className="max-h-[50vh] w-full object-cover"
              src={`${thumbnail}`}
              width={1920}
              height={1080}
              alt={name}
            />
          </DialogTrigger>
          <DialogContent className="max-h-full max-w-full overflow-y-auto">
            <Image src={`${thumbnail}`} width={1920} height={1080} alt={name} />
          </DialogContent>
        </Dialog>
      )}
      <div className="relative flex gap-2 rounded-md bg-card bg-cover bg-center p-2">
        <UserAvatar className="h-20 w-20" user={user} />
        <EllipsisButton className="absolute right-2 top-2 aspect-square border-none bg-transparent">
          <ProtectedElement session={session} ownerId={user.id}>
            <InternalLink variant="command" href="/users/@me/setting">
              <EditIcon />
              <Tran text="edit" />
            </InternalLink>
          </ProtectedElement>
        </EllipsisButton>
        <div className="flex h-full flex-col justify-between">
          <span className="text-2xl capitalize">{name}</span>
          <UserRoleCard className="text-2xl" roles={roles} />
          <span className="font-bold">LV.{level}</span>
          <div
            className="h-2 w-full rounded-full bg-success"
            style={{ width: progress }}
          />
        </div>
      </div>
    </div>
  );
}
