import UserCard from '@/components/user/user-card';
import getUser from '@/query/user/get-user';
import User from '@/types/response/User';
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
  const { data, isLoading, isError } = useQuery<User>({
    queryKey: ['users', id],
    queryFn: () => getUser({ id }),
  });

  if (isLoading) {
    return <UserCard.Loading />;
  }

  if (!data || isError) {
    return 'Error';
  }

  return <UserCard user={data} />;
}
