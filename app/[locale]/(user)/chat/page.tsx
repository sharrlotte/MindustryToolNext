'use client';

import { motion } from 'framer-motion';
import { ChevronRight, SendIcon, SmileIcon } from 'lucide-react';
import React, { FormEvent, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import LoginButton from '@/components/button/login-button';
import LoadingSpinner from '@/components/common/loading-spinner';
import MessageList from '@/components/common/message-list';
import { MemberCard } from '@/components/messages/member-card';
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
      <RoomPanel />
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
                <MessageList
                  className="flex flex-col gap-1 h-full"
                  queryKey={['global']}
                  room="GLOBAL"
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
                </MessageList>
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
          <ChatInput />
        </ProtectedElement>
      </div>
      <MemberPanel />
    </div>
  );
}

function ChatInput() {
  const [message, setMessage] = useState<string>('');
  const { state } = useSocket();

  const t = useI18n();
  const { sendMessage } = useMessage({
    room: 'GLOBAL',
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
  const isMedium = useMediaQuery('(min-width: 640px)');

  const [state, setState] = useState<'open' | 'close'>('close');

  const { data } = useQuery({
    queryKey: ['member-count', 'GLOBAL'],
    queryFn: () =>
      socket
        .onRoom('GLOBAL')
        .await({ method: 'GET_MEMBER', page: 0, size: 10 }),
  });

  return (
    <div>
      <motion.div
        className="h-full absolute right-0 sm:relative overflow-y-auto top-0 bg-card flex flex-col items-start"
        animate={state}
        variants={{
          open: {
            width: isMedium ? 300 : 'min(100%, 300px)',
          },
          close: {
            width: 'auto',
          },
        }}
      >
        <motion.div
          animate={state}
          variants={{
            open: {
              rotate: 0,
            },
            close: {
              rotate: 180,
            },
          }}
        >
          <Button
            title="Close"
            variant="icon"
            onClick={() =>
              setState((prev) => (prev === 'open' ? 'close' : 'open'))
            }
          >
            <ChevronRight />
          </Button>
        </motion.div>
        {state === 'open' &&
          data?.map((user) => <MemberCard key={user.id} user={user} />)}
      </motion.div>
      <Button
        title="Close"
        variant="icon"
        onClick={() => setState((prev) => (prev === 'open' ? 'close' : 'open'))}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

function RoomPanel() {
  const isMedium = useMediaQuery('(min-width: 640px)');

  const [state, setState] = useState<'open' | 'close'>('open');
  return (
    <div>
      <motion.div
        className="h-full absolute left-0 sm:relative overflow-y-auto top-0 bg-card flex flex-col items-start"
        animate={state}
        variants={{
          open: {
            width: isMedium ? 200 : 'min(100%, 300px)',
          },
          close: {
            width: 'auto',
          },
        }}
      >
        <Button
          title="Close"
          variant="icon"
          onClick={() =>
            setState((prev) => (prev === 'open' ? 'close' : 'open'))
          }
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
        Global
      </motion.div>
      <Button
        title="Close"
        variant="icon"
        onClick={() => setState((prev) => (prev === 'open' ? 'close' : 'open'))}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
