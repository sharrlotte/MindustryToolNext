'use client';

import GridPaginationList from '@/components/common/grid-pagination-list';
import { GridLayout } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import UserCardSkeleton from '@/components/skeleton/user-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import UserCard from '@/components/user/user-card';
import { useSession } from '@/context/session-context';
import useClientApi from '@/hooks/use-client';
import useClientQuery from '@/hooks/use-client-query';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { cn } from '@/lib/utils';
import { getMyRank, getRank, getUsersCount } from '@/query/user';
import { User } from '@/types/response/User';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export function PageClient() {
  const params = useSearchPageParams(20);
  const { page, size } = params;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-6">
            <Tran text="rank.rank" />
          </TableHead>
          <TableHead className="w-full">
            <Tran text="rank.user" />
          </TableHead>
          <TableHead className="w-10">
            <Tran text="rank.level" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="h-full overflow-y-auto">
        <GridPaginationList
          params={params}
          queryKey={['rank']}
          getFunc={getRank}
          skeleton={{
            amount: 20,
            item: <RankCardSkeleton />,
          }}
          asChild
        >
          {(data, index) => (
            <UserRankCard
              key={data.id}
              user={data}
              rank={page * size + index + 1}
            />
          )}
        </GridPaginationList>
        <MyRankCard />
      </TableBody>
    </Table>
  );
}

type UserCardRankProps = {
  user: User;
  rank: number;
};

export default function UserRankCard({ user, rank }: UserCardRankProps) {
  const { session } = useSession();

  const level = Math.floor(Math.sqrt(user.stats?.EXP ?? 0));

  return (
    <TableRow className={cn({ 'bg-secondary': session?.id === user.id })}>
      <TableCell>{rank}</TableCell>
      <TableCell className="align-top">
        <UserCard user={user} />
      </TableCell>
      <TableCell>{level}</TableCell>
    </TableRow>
  );
}

function RankCardSkeleton() {
  return (
    <TableRow>
      <TableCell className="align-top">
        <UserCardSkeleton />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-full" />
      </TableCell>
    </TableRow>
  );
}

function MyRankCard() {
  const axios = useClientApi();
  const { session, state } = useSession();
  const params = useSearchPageParams(20);
  const { page, size } = params;
  const { data, isFetching } = useQuery({
    queryKey: ['my-rank'],
    queryFn: () => getMyRank(axios),
  });

  if (state === 'unauthenticated') {
    return;
  }

  if (!session || isFetching) {
    return <RankCardSkeleton />;
  }

  const index = (data ?? 0) - 1;
  const startIndex = page * size;
  const endIndex = (page + 1) * size;

  if (startIndex <= index && index < endIndex) {
    return;
  }

  const level = Math.floor(Math.sqrt(session.stats?.EXP ?? 0));

  return (
    <TableRow className="bg-secondary">
      <TableCell className="align-top">{data}</TableCell>
      <TableCell className="align-top">
        <UserCard user={session} />
      </TableCell>
      <TableCell>{level}</TableCell>
    </TableRow>
  );
}

export function RankPaginationNavigator() {
  const params = useSearchPageParams(20);

  const { data } = useClientQuery({
    queryKey: ['rank', 'total'],
    queryFn: (axios) => getUsersCount(axios),
    placeholderData: 0,
  });

  return (
    <div className="mt-auto flex justify-end">
      <GridLayout>
        <PaginationNavigator numberOfItems={data} />
      </GridLayout>
    </div>
  );
}
