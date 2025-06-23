import { motion } from 'framer-motion';

import { RelativeTime } from '@/components/common/relative-time';

import { WorkflowEvent } from '@/types/response/WorkflowEvent';

import usePathId from '@/hooks/use-path-id';
import useSse from '@/hooks/use-sse';

import env from '@/constant/env';

export default function EventPanel() {
	const id = usePathId();
	const { data, state } = useSse<WorkflowEvent>(`${env.url.api}/servers/${id}/workflow/events`, {
		limit: 100,
	});

	return (
		<div className="space-y-1">
			<div>{state}</div>
			{data?.map((event) => (
				<motion.div className="p-2 bg-secondary rounded-md" key={event.id} layout>
					<div>{event.nodeId}</div>
					<div>{event.type}</div>
					<pre className="bg-transparent">{JSON.stringify(event.data, null, 2)}</pre>
					<RelativeTime date={new Date(event.createdAt)} />
				</motion.div>
			))}
		</div>
	);
}
