import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user/user-avatar';
import User from '@/types/response/User';
import React from 'react';

type UserCardProps = {
  user: User;
};
function UserCard({ user }: UserCardProps) {
  const { name, imageUrl } = user;

  return (
    <div className="flex w-56 items-end gap-2">
      <UserAvatar url={imageUrl} username={name} />
      <span className="capitalize">{name}</span>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex w-56 gap-2">
      <Skeleton className="h-8 w-8 rounded-full border-2 border-border" />
      <Skeleton className="w-full" />
    </div>
  );
}

UserCard.Loading = Loading;

export default UserCard;
