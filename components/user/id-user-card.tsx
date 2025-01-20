'use client';

import React from 'react';

import Tran from '@/components/common/tran';
import UserCardSkeleton from '@/components/skeleton/user-card-skeleton';
import UserCard from '@/components/user/user-card';

import useClientApi from '@/hooks/use-client';
import { getUser } from '@/query/user';
import { User } from '@/types/response/User';

import { useQuery } from '@tanstack/react-query';
import { persister } from '@/query/config/query-config';

type IdUserCardProps = {
  id: string | 'community';
};

export default function IdUserCard({ id }: IdUserCardProps) {
  if (id === 'null' || id == null || id == undefined || id.length === 0) {
    return <span></span>;
  }

  return <FletchUserCard id={id} />;
}

function FletchUserCard({ id }: IdUserCardProps) {
  const axios = useClientApi();
  const { data, isLoading, isError, error } = useQuery<User>({
    queryKey: ['users', id],
    queryFn: () => getUser(axios, { id }),
    retry: false,
    persister
  });

  if (isError || error) {
    if ('status' in error && error.status === 404) {
      return undefined;
    }

    return (
      <div className="col-span-full flex h-full flex-col w-full items-center text-center justify-center">
        <Tran className="font-semibold" text="error" />
        <p className="text-muted-foreground">{JSON.stringify(error)}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return <UserCardSkeleton />;
  }

  return <UserCard user={data} />;
}
