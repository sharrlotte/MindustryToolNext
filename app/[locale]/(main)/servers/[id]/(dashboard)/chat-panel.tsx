import Tran from '@/components/common/tran';
import { Skeleton } from '@/components/ui/skeleton';

import dynamic from 'next/dynamic';

const ChatInput = dynamic(() => import('@/components/messages/chat-input'), {
	loading: () => <div className="border relative border-border flex gap-1 rounded-md w-full bg-card min-h-[46px]" />,
});
const Divider = dynamic(() => import('@/components/ui/divider'));

const ChatList = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/chat-list'), {
	loading: () => <Skeleton className="h-full w-full" />,
});

type Props = {
	id: string;
};

export default async function ChatPanel({ id }: Props) {
	return (
		<div className="flex flex-col flex-1 w-full md:w-[min(100vw,350px)] overflow-hidden bg-card rounded-md border min-h-[50dvh]">
			<h3 className="font-semibold p-2">
				<Tran asChild text="server.chat" />
			</h3>
			<Divider />
			<ChatList />
			<ChatInput className="p-2 mt-auto" room={`SERVER_CHAT-${id}`} />
		</div>
	);
}
