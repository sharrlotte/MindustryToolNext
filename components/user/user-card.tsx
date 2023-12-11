import { Skeleton } from '@/components/ui/skeleton';
import User from '@/types/response/User';
import Image from 'next/image';
import React from 'react';

type UserCardProps = {
  user: User;
};
function UserCard({ user }: UserCardProps) {
  const { name, imageUrl } = user;

  return (
    <div className="flex w-56 items-end gap-2">
      {imageUrl ? (
        <Image
          className="rounded-full border-2 border-border"
          height={32}
          width={32}
          src={imageUrl}
          alt={name}
        />
      ) : (
        <div></div>
      )}
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
