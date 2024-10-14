'use client';

import React, { useState } from 'react';

import ComboBox from '@/components/common/combo-box';
import InfinitePage from '@/components/common/infinite-page';
import { Input } from '@/components/ui/input';
import { UserManagementCard } from '@/app/[locale]/(admin)/admin/users/user-management-card';
import { UserRole } from '@/constant/enum';
import useQueryState from '@/hooks/use-query-state';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { Role } from '@/types/response/Role';

import { useQuery } from '@tanstack/react-query';
import { getRoles } from '@/query/role';
import { getUserCount, getUsers } from '@/query/user';
import { GridLayout, ListLayout } from '@/components/common/pagination-layout';
import GridPaginationList from '@/components/common/grid-pagination-list';
import PaginationNavigator from '@/components/common/pagination-navigator';
import { omit } from 'lodash';
import useClientQuery from '@/hooks/use-client-query';

const defaultState = {
  name: '',
};

export function UserTable() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const params = useSearchPageParams();

  const [{ name }, setQueryState] = useQueryState(defaultState);
  const [role, setRole] = useState<Role>();
  const { data: roles } = useClientQuery({
    queryFn: (axios) => getRoles(axios),
    queryKey: ['roles'],
  });

  const { data: userCount } = useClientQuery({
    queryKey: ['maps', 'total', omit(params, 'page', 'size')],
    queryFn: (axios) => getUserCount(axios, { ...params, role: role?.name as UserRole }),
    placeholderData: 0,
  });

  return (
    <div className="flex h-full w-full flex-col space-y-2 overflow-hidden">
      <div>
        <div className="flex h-10 gap-2">
          <Input className="h-full" value={name} onChange={(event) => setQueryState({ name: event.target.value })} placeholder="Search using username" />
          <ComboBox className="h-full" placeholder="Select role" value={{ value: role, label: role?.name ?? '' }} values={roles?.map((d) => ({ value: d, label: d.name })) ?? []} onChange={(value) => setRole(value)} />
        </div>
      </div>
      <ListLayout>
        <div className="flex h-full flex-col gap-2 overflow-y-auto pr-2" ref={(ref) => setContainer(ref)}>
          <InfinitePage className="flex h-full w-full flex-col justify-start gap-2" params={{ ...params, role: role?.name as UserRole }} queryKey={['users', 'management']} getFunc={getUsers} container={() => container}>
            {(data) => <UserManagementCard key={data.id} user={data} />}
          </InfinitePage>
        </div>
      </ListLayout>
      <GridLayout>
        <GridPaginationList className="flex flex-col gap-2" params={{ ...params, role: role?.name as UserRole }} queryKey={['users', 'management']} getFunc={getUsers}>
          {(data) => <UserManagementCard key={data.id} user={data} />}
        </GridPaginationList>
      </GridLayout>
      <div className="flex flex-wrap items-center justify-end gap-2 sm:flex-row-reverse sm:justify-between">
        <GridLayout>
          <PaginationNavigator numberOfItems={userCount} />
        </GridLayout>
      </div>
    </div>
  );
}
