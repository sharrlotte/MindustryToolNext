'use client';

import { motion } from 'framer-motion';
import { SendIcon, SmileIcon } from 'lucide-react';
import React, { FormEvent, useRef, useState } from 'react';

import LoginButton from '@/components/button/login-button';
import InfiniteScrollList from '@/components/common/infinite-scroll-list';
import LoadingSpinner from '@/components/common/loading-spinner';
import { MessageCard } from '@/components/messages/message-card';
import { Button } from '@/components/ui/button';
import { useSession } from '@/context/session-context';
import { useSocket } from '@/context/socket-context';
import useMessage from '@/hooks/use-message';
import ProtectedElement from '@/layout/protected-element';
import { useI18n } from '@/locales/client';

import { useQuery } from '@tanstack/react-query';

export default function Page() {
  const { socket, state } = useSocket();
  const { session } = useSession();

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="grid h-full w-full grid-rows-[1fr_3rem] gap-2 overflow-hidden">
        <div className="grid h-full w-full overflow-hidden rounded-md p-2">
          <div className="flex h-full flex-col gap-1 overflow-x-hidden">
            {state !== 'connected' ? (
              <LoadingSpinner className="m-auto" />
            ) : (
              <div
                className="h-full overflow-y-auto"
                ref={(ref) => setContainer(ref)}
              >
                <InfiniteScrollList
                  className="flex flex-col gap-1 h-full"
                  queryKey={['global']}
                  reversed
                  container={() => container}
                  params={{ page: 0, size: 40 }}
                  end={<></>}
                  noResult={
                    <div className="h-full w-full flex justify-center font-semibold items-center">
                      {"Let's start a conversation"}
                    </div>
                  }
                  getFunc={(
                    _,
                    params: {
                      page: number;
                      size: number;
                    },
                  ) =>
                    socket
                      .onRoom('GLOBAL')
                      .await({ method: 'GET_MESSAGE', ...params })
                  }
                >
                  {(data) => <MessageCard key={data.id} message={data} />}
                </InfiniteScrollList>
              </div>
            )}
          </div>
        </div>
        <ProtectedElement
          session={session}
          all={['USER']}
          alt={
            <div className="h-full w-full text-center whitespace-nowrap">
              <LoginButton className="justify-center bg-button">
                Login to chat
              </LoginButton>
            </div>
          }
        >
          <ChatInput containerElement={container} />
        </ProtectedElement>
      </div>
      <MemberPanel />
    </div>
  );
}

type ChatInputProps = {
  containerElement: HTMLDivElement | null;
};

function ChatInput({ containerElement }: ChatInputProps) {
  const [message, setMessage] = useState<string>('');
  const { state } = useSocket();

  const t = useI18n();
  const { sendMessage } = useMessage({
    containerElement,
    room: 'GLOBAL',
    queryKey: ['global'],
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    sendMessage(message);
    setMessage('');
    event.preventDefault();
  };
  return (
    <form
      className="flex h-10 flex-1 gap-1 px-2"
      name="text"
      onSubmit={handleFormSubmit}
    >
      <div className="rounded-md border border-border bg-background px-2 w-full flex items-center">
        <input
          className="h-full w-full outline-none bg-transparent"
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <SmileIcon className="w-6 h-6" />
      </div>
      <Button
        className="h-full"
        variant="primary"
        type="submit"
        title={t('send')}
        disabled={state !== 'connected' || !message}
      >
        <SendIcon className="w-5 h-5" />
      </Button>
    </form>
  );
}

function MemberPanel() {
  const { socket } = useSocket();

  const [state, setState] = useState<'open' | 'close'>('open');

  const { data } = useQuery({
    queryKey: ['member-count'],
    queryFn: () =>
      socket
        .onRoom('GLOBAL')
        .await({ method: 'GET_MEMBER', page: 0, size: 10 }),
  });

  return (
    <motion.div
      className="h-full overflow-y-auto bg-card absolute right-0 md:relative"
      animate={state}
      variants={{
        open: {
          width: 250,
        },
        close: {
          width: 100,
        },
      }}
    >
      {data?.map((user) => user.name)}
    </motion.div>
  );
}
