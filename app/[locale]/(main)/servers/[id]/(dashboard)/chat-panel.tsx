import dynamic from 'next/dynamic';

import ChatInput from '@/components/messages/chat-input';
import { Skeleton } from '@/components/ui/skeleton';

const ServerConsolePage = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/chat-list'), {
	loading: () => <Skeleton className="h-full w-full" />,
});

type Props = {
	id: string;
};

export default async function ChatPanel({ id }: Props) {
	return (
		<div className="grid h-full w-full grid-rows-[1fr_auto] overflow-hidden">
			<div className="overflow-x-hidden bg-card">
				<ServerConsolePage />
			</div>
			<ChatInput room={`SERVER_CHAT-${id}`} />
		</div>
	);
}
