'use client';

import ServerBuildLogCard from '@/app/[locale]/(main)/servers/[id]/logs/server-build-log-card';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

import { getServerBuildLog, getServerBuildLogCount, getServerLoginCount, getServerLogins } from '@/query/server';
import { ServerBuildLog } from '@/types/response/ServerBuildLog';
import { PaginationQuerySchema } from '@/types/schema/search-query';

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
						<ServerTabsTrigger animate={false} className="data-[selected=true]:bg-muted h-10" value="login-log">
							<Tran text="server.login-log" />
						</ServerTabsTrigger>
						<ServerTabsTrigger animate={false} className="data-[selected=true]:bg-muted h-10" value="kick-log">
							<Tran text="server.kick-log" />
						</ServerTabsTrigger>
						<ServerTabsTrigger animate={false} className="data-[selected=true]:bg-muted h-10" value="building-destroy-log">
							<Tran text="server.building-destroy-log" />
						</ServerTabsTrigger>
					</ServerTabsList>
				</div>
				<ScrollContainer>
					<ServerTabsContent className="space-y-2" value="login-log">
						<ListLayout>
							<InfinitePage
								className="grid grid-cols-1"
								paramSchema={PaginationQuerySchema}
								queryKey={['server', id, 'login']}
								queryFn={(axios, params) => getServerLogins(axios, id, params)}
							>
								{(data) =>
									data.map((item, index) => <ServerLoginLogCard serverId={id} key={item.id} index={index} data={item} />)
								}
							</InfinitePage>
						</ListLayout>
						<GridLayout>
							<GridPaginationList
								className="grid grid-cols-1"
								paramSchema={PaginationQuerySchema}
								queryKey={['server', id, 'login']}
								queryFn={(axios, params) => getServerLogins(axios, id, params)}
							>
								{(data) =>
									data.map((item, index) => <ServerLoginLogCard serverId={id} key={item.id} index={index} data={item} />)
								}
							</GridPaginationList>
						</GridLayout>
					</ServerTabsContent>
					<ServerTabsContent className="space-y-2" value="building-destroy-log">
						<ListLayout>
							<InfinitePage
								className="grid grid-cols-1"
								paramSchema={PaginationQuerySchema}
								queryKey={['server', id, 'building-destroy-log']}
								queryFn={(axios, params) => getServerBuildLog(axios, id, params)}
							>
								{(data) =>
									groupBuildLog(data).map((item, index) => (
										<ServerBuildLogCard serverId={id} key={index} index={index} data={item} />
									))
								}
							</InfinitePage>
						</ListLayout>
						<GridLayout>
							<GridPaginationList
								className="grid grid-cols-1"
								paramSchema={PaginationQuerySchema}
								queryKey={['server', id, 'building-destroy-log']}
								queryFn={(axios, params) => getServerBuildLog(axios, id, params)}
							>
								{(data) =>
									groupBuildLog(data).map((item, index) => (
										<ServerBuildLogCard serverId={id} key={index} index={index} data={item} />
									))
								}
							</GridPaginationList>
						</GridLayout>
					</ServerTabsContent>
				</ScrollContainer>
				<div className="ml-auto mt-auto space-x-2 flex">
					<PaginationLayoutSwitcher />
					<GridLayout>
						<ServerTabsContent className="space-y-2" value="login-log">
							<div className="flex">
								<PaginationNavigator
									queryKey={['server', id, 'login']}
									numberOfItems={(axios) => getServerLoginCount(axios, id)}
								/>
							</div>
						</ServerTabsContent>
						<ServerTabsContent className="space-y-2" value="building-destroy-log">
							<div className="flex">
								<PaginationNavigator
									queryKey={['server', id, 'building-destroy-log']}
									numberOfItems={(axios) => getServerBuildLogCount(axios, id)}
								/>
							</div>
						</ServerTabsContent>
					</GridLayout>
				</div>
			</ServerTabs>
		</div>
	);
}

function groupBuildLog(logs: ServerBuildLog[]) {
	const result: {
		player: ServerBuildLog['player'];
		events: {
			building: ServerBuildLog['building'];
			message: ServerBuildLog['message'];
			createdAt: ServerBuildLog['createdAt'];
		}[];
	}[] = [];

	for (const log of logs) {
		if (result.length === 0) {
			result.push({
				player: log.player,
				events: [{ building: log.building, message: log.message, createdAt: log.createdAt }],
			});
			continue;
		}

		const last = result[result.length - 1];
		if (last.player.uuid === log.player.uuid) {
			last.events.push({ building: log.building, message: log.message, createdAt: log.createdAt });
			continue;
		}

		result.push({
			player: log.player,
			events: [{ building: log.building, message: log.message, createdAt: log.createdAt }],
		});
	}

	return result;
}
