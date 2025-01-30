'use client';

import { Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import React, { FormEvent, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { MemberPanel, MemberPanelProvider, MemberPanelTrigger } from '@/app/[locale]/(user)/chat/member-pannel';

import LoginButton from '@/components/button/login-button';
import { SearchIcon, SendIcon, SmileIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/loading-spinner';
import MessageList from '@/components/common/message-list';
import Tran from '@/components/common/tran';
import { MessageCard } from '@/components/messages/message-card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useSession } from '@/context/session-context.client';
import { useSocket } from '@/context/socket-context';
import useMessage from '@/hooks/use-message';
import ProtectedElement from '@/layout/protected-element';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });
export default function ChatPage() {
  const { session } = useSession();

  const isSmall = useMediaQuery('(max-width: 640px)');

  return (
    <MemberPanelProvider>
      <div className="flex h-full overflow-hidden">
        <div className="grid h-full w-full grid-rows-[auto_1fr_auto] overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-1">
            <div className="flex gap-4">
              <SearchIcon />
              #Global
            </div>
            <MemberPanelTrigger />
          </div>
          <div className="relative grid h-full w-full overflow-hidden">
            <div className="relative flex h-full flex-col gap-1 overflow-hidden">
              <MessageContainer />
              {isSmall && <MemberPanel room="GLOBAL" />}
            </div>
          </div>
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
            <ChatInput />
          </ProtectedElement>
        </div>
        {!isSmall && <MemberPanel room="GLOBAL" />}
      </div>
    </MemberPanelProvider>
  );
}

function MessageContainer() {
  const { state } = useSocket();

  if (state !== 'connected') {
    return <LoadingSpinner className="m-auto" />;
  }

  return (
    <MessageList
      showNotification
      className="flex h-full flex-col gap-1"
      queryKey={['global']}
      room="GLOBAL"
      params={{ size: 50 }}
      noResult={<div className="flex h-full w-full items-center justify-center font-semibold">{"Let's start a conversation"}</div>}
    >
      {(data) => <MessageCard key={data.id} message={data} />}
    </MessageList>
  );
}

function ChatInput() {
  const [message, setMessage] = useState<string>('');
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
    <form className="flex h-14 flex-1 gap-2 border-t px-2 py-2" name="text" onSubmit={handleFormSubmit}>
      <div className="flex w-full items-center gap-2 rounded-md border bg-background px-2">
        <input className="h-full w-full bg-transparent outline-none" value={message} onChange={(event) => setMessage(event.currentTarget.value)} />
        <Popover>
          <PopoverTrigger>
            <SmileIcon />
          </PopoverTrigger>
          <PopoverContent className="border-none bg-transparent">
            <EmojiPicker
              theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
              onEmojiClick={(emoji) => {
                setMessage(message + emoji.emoji);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button className="h-full" variant="outline" type="submit" title="send" disabled={state !== 'connected' || !message}>
        <SendIcon />
      </Button>
    </form>
  );
}
