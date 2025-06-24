import { AnimatePresence, motion } from 'framer-motion';

import { RelativeTime } from '@/components/common/relative-time';

import { WorkflowEvent } from '@/types/response/WorkflowEvent';


import { cn } from '@/lib/utils';
import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';

const colors = [
	'text-red-500',
	'text-orange-500',
	'text-amber-500',
	'text-yellow-500',
	'text-lime-500',
	'text-green-500',
	'text-emerald-500',
	'text-teal-500',
	'text-cyan-500',
	'text-sky-500',
	'text-blue-500',
	'text-indigo-500',
	'text-violet-500',
	'text-purple-500',
	'text-fuchsia-500',
	'text-pink-500',
	'text-rose-500',
];

export default function EventPanel() {
	const { events } = useWorkflowEditor();

	return (
		<div className="space-y-1 text-muted-foreground">
			<AnimatePresence>{events?.toReversed().map((event) => <EventCard event={event} key={event.id} />)}</AnimatePresence>
		</div>
	);
}

function EventCard({ event }: { event: WorkflowEvent }) {
	const hash = [...event.name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
	const index = hash % colors.length;

	return (
		<motion.div className="p-2 bg-secondary rounded-md text-xs" key={event.id}>
			<div className={cn('text-foreground space-x-1 font-semibold text-sm text-nowrap text-ellipsis', colors[index])}>
				<span>{event.name}</span>
				<span>({event.nodeId.slice(0, 7)})</span>
			</div>
			{event.value && <pre className="bg-transparent border-0">{JSON.stringify(event.value, null, 2)}</pre>}
			<RelativeTime date={new Date(event.createdAt)} />
		</motion.div>
	);
}
