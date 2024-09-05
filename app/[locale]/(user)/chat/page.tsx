'use client';

import { motion } from 'framer-motion';
import {
  ChevronRight,
  PaperclipIcon,
  SearchIcon,
  SendIcon,
  SmileIcon,
  UsersIcon,
} from 'lucide-react';
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
  const { state } = useSocket();
  const { session } = useSession();

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [openMemberPanel, setOpenMemberPanel] = useState<'open' | 'close'>(
    'close',
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-1">
        <div className="flex gap-4">
          <SearchIcon className="h-5 w-5" />
          #Global
        </div>
        <Button
          className="p-0"
          title="Close"
          variant="icon"
          onClick={() =>
            setOpenMemberPanel((prev) => (prev === 'open' ? 'close' : 'open'))
          }
        >
          <UsersIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid h-full w-full grid-rows-[1fr_auto] overflow-hidden">
        <div className="grid h-full w-full overflow-hidden pl-2">
          <div className="flex h-full flex-col gap-1 overflow-x-hidden">
            {state !== 'connected' ? (
              <LoadingSpinner className="m-auto" />
            ) : (
              <div className="flex h-full overflow-hidden">
                <div
                  className="h-full w-full overflow-y-auto"
                  ref={(ref) => setContainer(ref)}
                >
                  <MessageList
                    className="flex h-full flex-col gap-1"
                    queryKey={['global']}
                    room="GLOBAL"
                    container={() => container}
                    params={{ size: 50 }}
                    noResult={
                      <div className="flex h-full w-full items-center justify-center font-semibold">
                        {"Let's start a conversation"}
                      </div>
                    }
                  >
                    {(data) => <MessageCard key={data.id} message={data} />}
                  </MessageList>
                </div>
                <MemberPanel
                  state={openMemberPanel}
                  setState={setOpenMemberPanel}
                />
              </div>
            )}
          </div>
        </div>
        <ProtectedElement
          session={session}
          alt={
            <div className="h-full w-full whitespace-nowrap text-center">
              <LoginButton className="justify-center bg-brand">
                Login to chat
              </LoginButton>
            </div>
          }
        >
          <ChatInput />
        </ProtectedElement>
      </div>
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
      className="flex h-14 flex-1 gap-1 border-t px-2 py-2"
      name="text"
      onSubmit={handleFormSubmit}
    >
      <div className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-2">
        <input
          className="h-full w-full bg-transparent outline-none"
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <PaperclipIcon className="h-6 w-6" />
        <SmileIcon className="h-6 w-6" />
      </div>
      <Button
        className="h-full"
        variant="primary"
        type="submit"
        title={t('send')}
        disabled={state !== 'connected' || !message}
      >
        <SendIcon className="h-5 w-5" />
      </Button>
    </form>
  );
}

type MemberPanelProps = {
  state: 'open' | 'close';
  setState: (func: (prev: 'open' | 'close') => 'open' | 'close') => void;
};

function MemberPanel({ state, setState }: MemberPanelProps) {
  const { socket } = useSocket();
  const isMedium = useMediaQuery('(min-width: 640px)');

  const { data } = useQuery({
    queryKey: ['member-count', 'GLOBAL'],
    queryFn: () =>
      socket
        .onRoom('GLOBAL')
        .await({ method: 'GET_MEMBER', page: 0, size: 10 }),
  });

  return (
    <motion.div
      className="absolute right-0 top-0 flex h-full flex-col items-start overflow-y-auto bg-card sm:relative"
      animate={state}
      variants={{
        open: {
          width: isMedium ? 300 : '100%',
        },
        close: {
          width: 0,
        },
      }}
    >
      <Button
        title="Close"
        variant="icon"
        onClick={() => setState((prev) => (prev === 'open' ? 'close' : 'open'))}
      >
        <ChevronRight />
      </Button>
      {state === 'open' &&
        data?.map((user) => <MemberCard key={user.id} user={user} />)}
    </motion.div>
  );
}
