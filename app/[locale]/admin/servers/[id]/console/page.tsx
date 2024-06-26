'use client';

import React, { FormEvent, KeyboardEvent, useRef, useState } from 'react';

import InfiniteScrollList from '@/components/common/infinite-scroll-list';
import LoadingSpinner from '@/components/common/loading-spinner';
import { MessageCard } from '@/components/messages/message-card';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/context/socket-context';
import useMessage from '@/hooks/use-message';
import useSearchId from '@/hooks/use-search-id-params';
import { useI18n } from '@/locales/client';

const queryParam = { page: 0, size: 40 };

export default function Page() {
  const { id } = useSearchId();

  const { socket, state } = useSocket();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="grid h-full w-full grid-rows-[1fr_3rem] gap-2 overflow-hidden bg-card px-2 pt-2">
      <div className="grid h-full w-full overflow-hidden">
        <div className="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden bg-black/80 text-white">
          {state !== 'connected' ? (
            <LoadingSpinner className="m-auto" />
          ) : (
            <div
              className="h-full overflow-y-auto"
              ref={(ref) => setContainer(ref)}
            >
              <InfiniteScrollList
                className="flex flex-col gap-1 h-full"
                queryKey={[`server-${id}-message`, id]}
                reversed
                container={() => container}
                params={queryParam}
                end={<></>}
                getFunc={(_, params) =>
                  socket
                    .onRoom(`SERVER-${id}`)
                    .await({ method: 'GET_MESSAGE', ...params })
                }
              >
                {(data, index) => <MessageCard key={index} message={data} />}
              </InfiniteScrollList>
            </div>
          )}
        </div>
      </div>
      <ChatInput id={id} containerElement={container} />
    </div>
  );
}

type ChatInputProps = {
  id: string;
  containerElement: HTMLDivElement | null;
};

function ChatInput({ id, containerElement }: ChatInputProps) {
  const { state } = useSocket();

  const [message, setMessage] = useState<string>('');
  const t = useI18n();

  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  let [messagesCursor, setMessageCursor] = useState(0);

  const { sendMessage } = useMessage({
    containerElement,
    room: `SERVER-${id}`,
    queryKey: [`server-${id}-message`],
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    sendMessage(message);
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
    <form
      className="flex h-10 flex-1 gap-1"
      name="text"
      onSubmit={handleFormSubmit}
    >
      <input
        className="h-full w-full rounded-sm border border-border bg-background px-2 outline-none"
        value={message}
        onKeyDown={handleKeyPress}
        onChange={(event) => setMessage(event.currentTarget.value)}
      />
      <Button
        className="h-full"
        variant="primary"
        type="submit"
        title={t('send')}
        disabled={state !== 'connected' || !message}
      >
        {t('send')}
      </Button>
    </form>
  );
}
