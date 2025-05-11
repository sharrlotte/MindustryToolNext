'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import LoginButton from '@/components/button/login.button';
import { SearchIcon } from '@/components/common/icons';
import MessageList from '@/components/common/message-list';
import Tran from '@/components/common/tran';
import ChatInput from '@/components/messages/chat-input';
import { MemberPanel, MemberPanelProvider, MemberPanelTrigger } from '@/components/messages/member-pannel';
import { MessageCard } from '@/components/messages/message-card';

import { useSession } from '@/context/session.context';
import IsSmall from '@/layout/is-small';
import ProtectedElement from '@/layout/protected-element';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function ChatPage() {
	return (
		<MemberPanelProvider>
			<div className="flex h-full overflow-hidden">
				<div className="grid h-full w-full grid-rows-[auto_1fr_auto] overflow-hidden">
					<div className="flex items-center justify-between border-b px-4 py-1">
						<div className="flex gap-2 items-center">
							<SearchIcon />
							#Global
						</div>
						<MemberPanelTrigger />
					</div>
					<div className="relative grid h-full w-full overflow-hidden">
						<div className="relative flex h-full flex-col gap-1 overflow-hidden">
							<MessageContainer />
							<IsSmall small={<MemberPanel room="GLOBAL" />} />
						</div>
					</div>
					<GlobalChatInput />
				</div>
				<IsSmall notSmall={<MemberPanel room="GLOBAL" />} />
			</div>
		</MemberPanelProvider>
	);
}

function MessageContainer() {
	return (
		<MessageList
			showNotification={false}
			className="flex h-full flex-col gap-1"
			queryKey={['global']}
			room="GLOBAL"
			params={{ size: 50 }}
			noResult={
				<div className="flex h-full w-full items-center justify-center font-semibold">{"Let's start a conversation"}</div>
			}
		>
			{(data) => <MessageCard key={data.id} message={data} />}
		</MessageList>
	);
}

function GlobalChatInput() {
	const { session } = useSession();

	return (
		<ProtectedElement
			session={session}
			filter={true}
			alt={
				<div className="h-full mx-auto whitespace-nowrap border-t p-2 text-center">
					<LoginButton className="justify-center">
						<Tran text="chat.require-login" />
					</LoginButton>
				</div>
			}
		>
			<ChatInput room="GLOBAL" />
		</ProtectedElement>
	);
}
