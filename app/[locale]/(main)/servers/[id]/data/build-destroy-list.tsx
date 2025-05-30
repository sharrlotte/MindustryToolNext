'use client';

import ServerBuildLogCard from '@/app/[locale]/(main)/servers/[id]/data/server-build-log-card';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout } from '@/components/common/pagination-layout';

import usePathId from '@/hooks/use-path-id';
import { getServerBuildLog } from '@/query/server';
import { ServerBuildLog } from '@/types/response/ServerBuildLog';
import { PaginationQuerySchema } from '@/types/schema/search-query';

export default function BuildDestroyList() {
	const id = usePathId();

	return (
		<>
			<ListLayout>
				<InfinitePage
					className="grid grid-cols-1 gap-2"
					paramSchema={PaginationQuerySchema}
					queryKey={['server', id, 'building-destroy-log']}
					queryFn={(axios, params) => getServerBuildLog(axios, id, params)}
				>
					{(data) =>
						groupBuildLog(data).map((item, index) => <ServerBuildLogCard serverId={id} key={index} index={index} data={item} />)
					}
				</InfinitePage>
			</ListLayout>
			<GridLayout>
				<GridPaginationList
					className="grid grid-cols-1 gap-2"
					paramSchema={PaginationQuerySchema}
					queryKey={['server', id, 'building-destroy-log']}
					queryFn={(axios, params) => getServerBuildLog(axios, id, params)}
				>
					{(data) =>
						groupBuildLog(data).map((item, index) => <ServerBuildLogCard serverId={id} key={index} index={index} data={item} />)
					}
				</GridPaginationList>
			</GridLayout>
		</>
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
