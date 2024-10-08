'use client';

import React, { useState } from 'react';

import ComboBox from '@/components/common/combo-box';
import InfinitePage from '@/components/common/infinite-page';
import { Input } from '@/components/ui/input';
import UserManagementCard from '@/components/user/user-management-card';
import { UserRole } from '@/constant/enum';
import useClientApi from '@/hooks/use-client';
import useQueryState from '@/hooks/use-query-state';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { Role } from '@/types/response/Role';

import { useQuery } from '@tanstack/react-query';
import { getRoles } from '@/query/role';
import { getUsers } from '@/query/user';

const defaultState = {
  name: '',
};

export default function Page() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const params = useSearchPageParams();
  const axios = useClientApi();

  const [{ name }, setQueryState] = useQueryState(defaultState);
  const [role, setRole] = useState<Role>();
  const { data } = useQuery({
    queryFn: () => getRoles(axios),
    queryKey: ['roles'],
  });

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex space-x-2">
        <Input
          value={name}
          onChange={(event) => setQueryState({ name: event.target.value })}
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
          params={{ ...params, role: role?.name as UserRole, size: 40 }}
          queryKey={['users', 'management']}
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
