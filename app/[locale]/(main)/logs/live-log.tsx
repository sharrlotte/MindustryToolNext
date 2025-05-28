import MessageList from "@/components/common/message-list";
import ChatInput from "@/components/messages/chat-input";
import { MessageCard } from "@/components/messages/message-card";

export default function LiveLog() {
	return (
		<div className="grid h-full w-full grid-rows-[1fr_auto] bg-card overflow-hidden">
			<div className="flex h-full w-full overflow-hidden rounded-md">
				<div className="flex h-full w-full overflow-hidden">
					<MessageList
						className="flex h-full w-full flex-col gap-2"
						queryKey={['live-log']}
						room="LOG"
						params={{ size: 50 }}
						showNotification={false}
					>
						{(data) => <MessageCard key={data.id} message={data} />}
					</MessageList>
				</div>
			</div>
			<ChatInput room="LOG" className="p-2" />
		</div>
	);
}
