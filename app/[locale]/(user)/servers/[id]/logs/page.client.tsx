'use client';

import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';

import { PaginationQuerySchema } from '@/query/search-query';
import { getServerLogins } from '@/query/server';

import ServerLoginLogCard from './server-login-log-card';

type Props = {
  id: string;
};
export default function PageClient({ id }: Props) {
  return (
    <ScrollContainer>
      <InfinitePage className="grid grid-cols-4 gap-2" paramSchema={PaginationQuerySchema} queryKey={['server-login']} queryFn={(axios, params) => getServerLogins(axios, id, params)}>
        {(data) => <ServerLoginLogCard key={data.id} data={data} />}
      </InfinitePage>
    </ScrollContainer>
  );
}
