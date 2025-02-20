'use client';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';

import { PaginationQuerySchema } from '@/query/search-query';
import { getServerLogins } from '@/query/server';

import ServerLoginLogCard from './server-login-log-card';

type Props = {
  id: string;
};
export default function PageClient({ id }: Props) {
  return (
    <div className="flex flex-col h-full gap-1">
      <div className="ml-auto">
        <PaginationLayoutSwitcher />
      </div>
      <div className="md:grid hidden md:grid-cols-4 gap-2 bg-card p-4">
        <Tran text="username" />
        <Tran text="uuid" />
        <Tran text="ip" />
        <Tran text="time" />
      </div>
      <ScrollContainer>
        <ListLayout>
          <InfinitePage className="grid grid-cols-1 gap-1" paramSchema={PaginationQuerySchema} queryKey={['server-login']} queryFn={(axios, params) => getServerLogins(axios, id, params)}>
            {(data, index) => <ServerLoginLogCard key={data.id} index={index} data={data} />}
          </InfinitePage>
        </ListLayout>
        <GridLayout>
          <GridPaginationList className="grid grid-cols-1" paramSchema={PaginationQuerySchema} queryKey={['server-login']} queryFn={(axios, params) => getServerLogins(axios, id, params)}>
            {(data, index) => <ServerLoginLogCard key={data.id} index={index} data={data} />}
          </GridPaginationList>
        </GridLayout>
      </ScrollContainer>
      <div className="ml-auto mt-auto">
        <GridLayout>
          <PaginationNavigator />
        </GridLayout>
      </div>
    </div>
  );
}
