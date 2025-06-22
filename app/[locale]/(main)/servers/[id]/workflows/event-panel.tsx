import { RelativeTime } from '@/components/common/relative-time';

import { WorkflowEvent } from '@/types/response/WorkflowEvent';

import usePathId from '@/hooks/use-path-id';
import useSse from '@/hooks/use-sse';

import env from '@/constant/env';

export default function EventPanel() {
	const id = usePathId();
	const { data, state } = useSse<WorkflowEvent>(`${env.url.api}/servers/${id}/workflow/events`, {
		limit: 1000,
	});

	return (
		<div>
			<div>{state}</div>
			{data?.map((event) => (
				<div key={event.id}>
					<div>{event.nodeId}</div>
					<div>{event.type}</div>
					<pre>{JSON.stringify(event.data, null, 2)}</pre>
					<RelativeTime date={new Date(event.createdAt)} />
				</div>
			))}
		</div>
	);
}
