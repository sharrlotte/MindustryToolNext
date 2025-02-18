'use client';

import InfinitePage from '@/components/common/infinite-page';
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
    <ScrollContainer>
      <div className="md:grid hidden md:grid-cols-4 gap-2 bg-card p-4">
        <Tran text="username" />
        <Tran text="uuid" />
        <Tran text="ip" />
        <Tran text="time" />
      </div>
      <InfinitePage className="grid" paramSchema={PaginationQuerySchema} queryKey={['server-login']} queryFn={(axios, params) => getServerLogins(axios, id, params)}>
        {(data, index) => <ServerLoginLogCard key={data.id} index={index} data={data} />}
      </InfinitePage>
    </ScrollContainer>
  );
}
