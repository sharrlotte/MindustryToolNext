'use client';

import React, { FormEvent, KeyboardEvent, useState } from 'react';

import LoadingSpinner from '@/components/common/loading-spinner';
import MessageList from '@/components/common/message-list';
import { MessageCard } from '@/components/messages/message-card';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/context/socket-context';
import useMessage from '@/hooks/use-message';
import useSearchId from '@/hooks/use-search-id-params';
import { Input } from '@/components/ui/input';
import Tran from '@/components/common/tran';

export default function Page() {
  const { id } = useSearchId();

  const { state } = useSocket();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="grid h-full w-full grid-rows-[1fr_2.5rem] gap-2 overflow-hidden">
      <div className="grid h-full w-full overflow-hidden">
        <div className="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden bg-background">
          {state !== 'connected' ? (
            <LoadingSpinner className="m-auto" />
          ) : (
            <div className="flex h-full w-full overflow-y-auto overflow-x-hidden" ref={(ref) => setContainer(ref)}>
              <MessageList
                className="flex h-full flex-col gap-1"
                queryKey={['servers', id, 'messages']}
                room={`SERVER-${id}`}
                container={() => container}
                params={{ size: 50 }}
                showNotification={false}
              >
                {(data) => <MessageCard key={data.id} message={data} />}
              </MessageList>
            </div>
          )}
        </div>
      </div>
      <ChatInput id={id} />
    </div>
  );
}

type ChatInputProps = {
  id: string;
};

function ChatInput({ id }: ChatInputProps) {
  const { state } = useSocket();

  const [message, setMessage] = useState<string>('');

  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [messagesCursor, setMessageCursor] = useState(0);

  const { sendMessage } = useMessage({
    room: `SERVER-${id}`,
    method: 'SERVER_MESSAGE',
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (message.startsWith('/')) {
      sendMessage(message.substring(1));
    } else {
      sendMessage('say ' + message);
    }
    setMessageHistory((prev) => [...prev, message]);
    setMessage('');
    event.preventDefault();
  };

  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (messageHistory.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp': {
        setMessageCursor((prev) => {
          prev--;

          if (prev < 0) {
            return messageHistory.length - 1;
          }

          return prev;
        });
        setMessage(messageHistory[messagesCursor]);
        break;
      }

      case 'ArrowDown': {
        setMessageCursor((prev) => {
          prev++;

          prev = prev % messageHistory.length;

          return prev;
        });
        setMessage(messageHistory[messagesCursor]);
        break;
      }
    }
  }
  return (
    <form className="flex h-full flex-1 gap-1" name="text" onSubmit={handleFormSubmit}>
      <Input
        className="h-full w-full rounded-sm border border-border bg-background px-2 outline-none"
        value={message}
        placeholder="/help"
        onKeyDown={handleKeyPress}
        onChange={(event) => setMessage(event.currentTarget.value)}
      />
      <Button className="h-full" variant="primary" type="submit" title="send" disabled={state !== 'connected' || !message}>
        <Tran text="send" />
      </Button>
    </form>
  );
}
