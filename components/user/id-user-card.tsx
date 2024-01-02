'use client';

import UserCard from '@/components/user/user-card';
import useClientAPI from '@/hooks/use-client';
import getUser from '@/query/user/get-user';
import { User } from '@/types/response/User';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

type IdUserCardProps = {
  id: string;
};

export default function IdUserCard({ id }: IdUserCardProps) {
  if (id.toLowerCase() === 'community') {
    return <span>Community</span>;
  }

  return <FletchUserCard id={id} />;
}

function FletchUserCard({ id }: IdUserCardProps) {
  const { axios, enabled } = useClientAPI();
  const { data, isLoading, isError } = useQuery<User>({
    queryKey: ['users', id],
    queryFn: () => getUser(axios, { id }),
    enabled,
  });

  if (isError) {
    return 'Error';
  }

  if (isLoading || !data) {
    return <UserCard.Loading />;
  }

  return <UserCard user={data} />;
}
