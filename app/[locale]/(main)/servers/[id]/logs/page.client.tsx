'use client';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

import { PaginationQuerySchema } from '@/query/search-query';
import { getServerLogins } from '@/query/server';

import ServerLoginLogCard from './server-login-log-card';

type Props = {
  id: string;
};
export default function PageClient({ id }: Props) {
  return (
    <div className="flex flex-col h-full gap-2">
      <ServerTabs name="type" value="login-log" values={['login-log', 'kick-log', 'building-destroy-log']}>
        <div className="flex justify-between items-center">
          <ServerTabsList className="px-0 py-0 gap-0">
            <ServerTabsTrigger animate={false} className="data-[selected=true]:bg-muted h-11" value="login-log">
              <Tran text="server.login-log" />
            </ServerTabsTrigger>
            <ServerTabsTrigger animate={false} className="data-[selected=true]:bg-muted h-11" value="kick-log">
              <Tran text="server.kick-log" />
            </ServerTabsTrigger>
            <ServerTabsTrigger animate={false} className="data-[selected=true]:bg-muted h-11" value="building-destroy-log">
              <Tran text="server.building-destroy-log" />
            </ServerTabsTrigger>
          </ServerTabsList>
        </div>
        <ScrollContainer>
          <ServerTabsContent className="space-y-2" value="login-log">
            <div className="md:grid hidden md:grid-cols-4 gap-2 bg-card p-4">
              <Tran text="username" />
              <Tran text="uuid" />
              <Tran text="ip" />
              <Tran text="time" />
            </div>
            <ListLayout>
              <InfinitePage className="grid grid-cols-1" paramSchema={PaginationQuerySchema} queryKey={['server', id, 'login']} queryFn={(axios, params) => getServerLogins(axios, id, params)}>
                {(data, index) => <ServerLoginLogCard key={data.id} index={index} data={data} />}
              </InfinitePage>
            </ListLayout>
            <GridLayout>
              <GridPaginationList className="grid grid-cols-1" paramSchema={PaginationQuerySchema} queryKey={['server', id, 'login']} queryFn={(axios, params) => getServerLogins(axios, id, params)}>
                {(data, index) => <ServerLoginLogCard key={data.id} index={index} data={data} />}
              </GridPaginationList>
            </GridLayout>
          </ServerTabsContent>
        </ScrollContainer>
        <div className="ml-auto mt-auto space-x-2">
          <PaginationLayoutSwitcher />
          <GridLayout>
            <PaginationNavigator />
          </GridLayout>
        </div>
      </ServerTabs>
    </div>
  );
}
