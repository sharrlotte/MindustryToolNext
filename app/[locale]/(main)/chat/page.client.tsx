'use client';

import { Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import React, { FormEvent, useState } from 'react';

import LoginButton from '@/components/button/login.button';
import { SearchIcon, SendIcon, SmileIcon } from '@/components/common/icons';
import MessageList from '@/components/common/message-list';
import Tran from '@/components/common/tran';
import { MemberPanel, MemberPanelProvider, MemberPanelTrigger } from '@/components/messages/member-pannel';
import { MessageCard } from '@/components/messages/message-card';
import { AutosizeTextarea } from '@/components/ui/autoresize-textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useSession } from '@/context/session.context';
import { useSocket } from '@/context/socket.context';
import useMessage from '@/hooks/use-message';
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
					<ChatInput />
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

function ChatInput() {
	const [message, setMessage] = useState<string>('');
	const { session } = useSession();
	const { state } = useSocket();

	const { sendMessage } = useMessage({
		room: 'GLOBAL',
	});

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		sendMessage(message);
		setMessage('');
		event.preventDefault();
	};

	const { theme } = useTheme();

	return (
		<ProtectedElement
			session={session}
			filter={true}
			alt={
				<div className="h-full w-full whitespace-nowrap border-t p-2 text-center">
					<LoginButton className="justify-center">
						<Tran text="chat.require-login" />
					</LoginButton>
				</div>
			}
		>
			<form className="flex min-h-13 flex-1 gap-2 p-2 border-t" name="text" onSubmit={handleFormSubmit}>
				<div className="border border-border flex gap-1 rounded-md w-full bg-card">
					<AutosizeTextarea
						className="h-full w-full bg-card px-2 outline-none border-none min-h-13 resize-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
						value={message}
						onChange={(event) => setMessage(event.currentTarget.value)}
					/>
					<div className="m-1 mt-auto flex items-center gap-2 min-h-9">
						<Popover>
							<PopoverTrigger>
								<SmileIcon />
							</PopoverTrigger>
							<PopoverContent className="border-transparent bg-transparent">
								<EmojiPicker
									theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
									onEmojiClick={(emoji) => {
										setMessage(message + emoji.emoji);
									}}
								/>
							</PopoverContent>
						</Popover>
						<Button
							className="text-brand"
							variant="ghost"
							size="icon"
							type="submit"
							title="send"
							disabled={state !== 'connected' || !message}
						>
							<SendIcon />
						</Button>
					</div>
				</div>
			</form>
		</ProtectedElement>
	);
}
