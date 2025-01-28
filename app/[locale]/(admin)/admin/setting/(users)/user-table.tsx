'use client';

import React, { useRef, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import { UserManagementCard } from '@/app/[locale]/(admin)/admin/setting/(users)/user-management-card';

import ComboBox from '@/components/common/combo-box';
import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import LoadingSpinner from '@/components/common/router-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import { Input } from '@/components/ui/input';

import useClientQuery from '@/hooks/use-client-query';
import useSearchQuery from '@/hooks/use-search-query';
import { useI18n } from '@/i18n/client';
import { omit } from '@/lib/utils';
import { getRoles } from '@/query/role';
import { PaginationQuerySchema } from '@/query/search-query';
import { getUserCount, getUsers } from '@/query/user';
import { Role } from '@/types/response/Role';

const defaultState = {
  name: '',
  is_banned: '',
};

const banFilterState = ['', 'true', 'false'];

export function UserTable() {
  const { t } = useI18n();
  const container = useRef<HTMLDivElement | null>(null);
  const params = useSearchQuery(PaginationQuerySchema);

  const [{ name, is_banned: isBanned }, setState] = useState(defaultState);
  const setQueryState = (value: Partial<typeof defaultState>) => setState((prev) => ({ ...prev, ...value }));

  const [role, setRole] = useState<Role>();
  const { data: roles } = useClientQuery({
    queryFn: (axios) => getRoles(axios).then((items) => items.sort((a, b) => b.position - a.position)),
    queryKey: ['roles'],
  });

  const [debouncedName] = useDebounceValue(name, 300);

  const { data: userCount } = useClientQuery({
    queryKey: ['users', 'total', omit(params, 'page', 'size'), debouncedName, isBanned],
    queryFn: (axios) => getUserCount(axios, { name, is_banned: isBanned, role: role?.name }),
    placeholderData: 0,
  });

  return (
    <div className="flex h-full w-full flex-col space-y-2 overflow-hidden">
      <div>
        <div className="flex h-10 gap-2">
          <Input className="h-full" value={name} onChange={(event) => setQueryState({ name: event.target.value })} placeholder="Search using username" />
          <ComboBox
            className="h-full"
            nullable
            searchBar={false}
            placeholder="All"
            value={{ value: isBanned, label: isBanned ?? '' }}
            values={banFilterState.map((d) => ({ value: d, label: d || 'All' }))}
            onChange={(value) => setQueryState({ is_banned: value ?? '' })}
          />
          <ComboBox className="h-full" nullable placeholder="Select role" value={{ value: role, label: role?.name ? t(role.name) : '' }} values={roles?.map((d) => ({ value: d, label: t(d.name) })) ?? []} onChange={(value) => setRole(value)} />
        </div>
      </div>
      <ScrollContainer className="flex h-full flex-col gap-2" ref={container}>
        <ListLayout>
          <InfinitePage
            className="flex h-full w-full flex-col justify-start gap-2"
            params={{ ...params, role: role?.name, name: debouncedName, is_banned: isBanned }}
            queryKey={['users', 'management']}
            queryFn={getUsers}
            loader={<LoadingSpinner className="p-0 m-auto" />}
          >
            {(data) => <UserManagementCard key={data.id} user={data} />}
          </InfinitePage>
        </ListLayout>
        <GridLayout>
          <GridPaginationList
            className="flex flex-col gap-2" //
            params={{ ...params, role: role?.name, name: debouncedName, is_banned: isBanned }}
            queryKey={['users', 'management']}
            queryFn={getUsers}
            loader={<LoadingSpinner className="p-0 m-auto" />}
          >
            {(data) => <UserManagementCard key={data.id} user={data} />}
          </GridPaginationList>
        </GridLayout>
      </ScrollContainer>
      <div className="flex flex-wrap items-center gap-2 justify-end">
        <GridLayout>
          <PaginationNavigator numberOfItems={userCount} />
        </GridLayout>
      </div>
    </div>
  );
}
