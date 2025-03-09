'use client';

import React from 'react';

import MessageList from '@/components/common/message-list';
import { MessageCard } from '@/components/messages/message-card';

type Props = {
  id: string;
};
export default function ServerConsolePage({ id }: Props) {
  return (
    <MessageList className="flex h-full flex-col gap-1" queryKey={['servers', id, 'messages']} room={`SERVER-${id}`} params={{ size: 50 }} showNotification={false}>
      {(data) => <MessageCard key={data.id} message={data} />}
    </MessageList>
  );
}
