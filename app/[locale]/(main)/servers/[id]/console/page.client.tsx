'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import MessageList from '@/components/common/message-list';
import { MessageCard } from '@/components/messages/message-card';

export default function ServerConsolePage() {
  const { id } = useParams();
  return (
    <MessageList className="flex h-full flex-col gap-1" queryKey={['servers', id, 'messages']} room={`SERVER-${id}`} params={{ size: 50 }} showNotification={false}>
      {(data) => <MessageCard key={data.id} message={data} />}
    </MessageList>
  );
}
