'use client';

import React, { useState } from 'react';

import ComboBox from '@/components/common/combo-box';
import InfinitePage from '@/components/common/infinite-page';
import { Input } from '@/components/ui/input';
import UserManagementCard from '@/components/user/user-management-card';
import { UserRole } from '@/constant/enum';
import useClientAPI from '@/hooks/use-client';
import useQueryState from '@/hooks/use-query-state';
import useSearchPageParams from '@/hooks/use-search-page-params';
import getRoles from '@/query/role/get-roles';
import getUsers from '@/query/user/get-users';
import { Role } from '@/types/response/Role';

import { useQuery } from '@tanstack/react-query';

export default function Page() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const params = useSearchPageParams();
  const axios = useClientAPI();

  const [name, setName] = useQueryState('name', '');
  const [role, setRole] = useState<Role>();
  const { data } = useQuery({
    queryFn: () => getRoles(axios),
    queryKey: ['roles'],
  });

  return (
    <div className="p-6 h-full space-y-6 flex flex-col">
      <div className="space-x-2 flex">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Search using username"
        />
        <ComboBox
          placeholder="Select role"
          value={{ value: role, label: role?.name ?? '' }}
          values={data?.map((d) => ({ value: d, label: d.name })) ?? []}
          onChange={(value) => setRole(value)}
        />
      </div>
      <div
        className="relative flex h-full flex-col gap-2 overflow-y-auto"
        ref={(ref) => setContainer(ref)}
      >
        <InfinitePage
          className="grid w-full grid-cols-1 justify-center gap-2 pr-2"
          params={{ ...params, role: role?.name as UserRole }}
          queryKey={['user-management']}
          getFunc={getUsers}
          container={() => container}
        >
          {(data) => <UserManagementCard key={data.id} user={data} />}
        </InfinitePage>
      </div>
      <div></div>
    </div>
  );
}
