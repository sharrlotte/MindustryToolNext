import dynamic from 'next/dynamic';

import Tran from '@/components/common/tran';
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
		<div className="grid w-full grid-rows-[1fr_auto] overflow-hidden bg-card rounded-md border min-h-[50dvh]">
			<div className="overflow-x-hidden p-4 space-y-2">
				<h3 className="font-semibold">
					<Tran asChild text="server.chat" />
				</h3>
				<ServerConsolePage />
			</div>
			<ChatInput className="p-2" room={`SERVER_CHAT-${id}`} />
		</div>
	);
}
