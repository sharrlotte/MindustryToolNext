'use client';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout } from '@/components/common/pagination-layout';

import usePathId from '@/hooks/use-path-id';
import { getServerLogins } from '@/query/server';
import { PaginationQuerySchema } from '@/types/schema/search-query';

import ServerLoginLogCard from './server-login-log-card';

export default function LoginLogList() {
	const id = usePathId();

	return (
		<>
			<ListLayout>
				<InfinitePage
					className="grid grid-cols-1 gap-2"
					paramSchema={PaginationQuerySchema}
					queryKey={['server', id, 'login']}
					queryFn={(axios, params) => getServerLogins(axios, id, params)}
				>
					{(data) => data.map((item, index) => <ServerLoginLogCard serverId={id} key={item.id} index={index} data={item} />)}
				</InfinitePage>
			</ListLayout>
			<GridLayout>
				<GridPaginationList
					className="grid grid-cols-1 gap-2"
					paramSchema={PaginationQuerySchema}
					queryKey={['server', id, 'login']}
					queryFn={(axios, params) => getServerLogins(axios, id, params)}
				>
					{(data) => data.map((item, index) => <ServerLoginLogCard serverId={id} key={item.id} index={index} data={item} />)}
				</GridPaginationList>
			</GridLayout>
		</>
	);
}
