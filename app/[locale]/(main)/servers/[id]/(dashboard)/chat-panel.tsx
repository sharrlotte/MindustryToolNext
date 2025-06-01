import dynamic from 'next/dynamic';

import Tran from '@/components/common/tran';
import ChatInput from '@/components/messages/chat-input';
import Divider from '@/components/ui/divider';
import { Skeleton } from '@/components/ui/skeleton';

const ServerConsolePage = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/chat-list'), {
	loading: () => <Skeleton className="h-full w-full" />,
});

type Props = {
	id: string;
};

export default async function ChatPanel({ id }: Props) {
	return (
		<div className="grid flex-1 w-full md:w-[min(100vw,350px)] grid-rows-[1fr_auto] overflow-hidden bg-card rounded-md border min-h-[50dvh]">
			<h3 className="font-semibold p-2">
				<Tran asChild text="server.chat" />
			</h3>
			<Divider />
			<ServerConsolePage />
			<ChatInput className="p-2" room={`SERVER_CHAT-${id}`} />
		</div>
	);
}
