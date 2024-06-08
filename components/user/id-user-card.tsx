'use client';

import UserCardSkeleton from '@/components/skeleton/user-card-skeleton';
import UserCard from '@/components/user/user-card';
import useClientAPI from '@/hooks/use-client';
import { useI18n } from '@/locales/client';
import getUser from '@/query/user/get-user';
import { User } from '@/types/response/User';

import { useQuery } from '@tanstack/react-query';
import React from 'react';

type IdUserCardProps = {
  id: string | 'community';
};

export default function IdUserCard({ id }: IdUserCardProps) {
  if (!id) {
    return <span>Invalid id</span>;
  }

  if (id.toLowerCase() === 'community') {
    return <span>Community</span>;
  }

  return <FletchUserCard id={id} />;
}

function FletchUserCard({ id }: IdUserCardProps) {
  const t = useI18n();
  const { axios, enabled } = useClientAPI();
  const { data, isLoading, isError, error } = useQuery<User>({
    queryKey: ['users', id],
    queryFn: () => getUser(axios, { id }),
    enabled,
  });

  if (isError || error) {
    return <span>{error?.message}</span>;
  }

  if (isLoading || !data || !enabled) {
    return <UserCardSkeleton />;
  }

  return <UserCard user={data} />;
}
