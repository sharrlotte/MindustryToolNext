'use client';

import React, { useRef } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import { Input } from '@/components/ui/input';
import UserManagementCard from '@/components/user/user-management-card';
import useQueryState from '@/hooks/use-query-state';
import useSearchPageParams from '@/hooks/use-search-page-params';
import getUsers from '@/query/user/get-users';

export default function Page() {
  const container = useRef<HTMLDivElement>(null);
  const params = useSearchPageParams();

  const [name, setName] = useQueryState('name', '');

  return (
    <div className="p-2 h-full space-y-2 flex flex-col">
      <Input value={name} onChange={(event) => setName(event.target.value)} />
      <div
        className="relative flex h-full flex-col gap-4 overflow-y-auto"
        ref={container}
      >
        <InfinitePage
          className="grid w-full grid-cols-1 justify-center gap-4"
          params={params}
          queryKey={['user-management']}
          getFunc={getUsers}
          container={() => container.current}
        >
          {(data) => <UserManagementCard key={data.name} user={data} />}
        </InfinitePage>
      </div>
    </div>
  );
}
