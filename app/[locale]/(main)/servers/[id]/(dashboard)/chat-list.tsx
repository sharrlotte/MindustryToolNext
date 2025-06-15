'use client';

import React from 'react';

import MessageList from '@/components/common/message-list';
import { MessageCard } from '@/components/messages/message-card';

import { useParams } from 'next/navigation';

export default function ServerConsolePage() {
	const { id } = useParams();

	return (
		<MessageList
			className="flex h-full flex-col gap-1"
			queryKey={['server', id, 'chat']}
			room={`SERVER_CHAT-${id}`}
			params={{ size: 50 }}
		>
			{(data) => <MessageCard key={data.id} message={data} />}
		</MessageList>
	);
}
