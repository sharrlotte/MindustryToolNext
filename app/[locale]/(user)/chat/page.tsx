'use client';

import React, { FormEvent, useState } from 'react';

import LoginButton from '@/components/button/login-button';
import LoadingSpinner from '@/components/common/loading-spinner';
import MessageList from '@/components/common/message-list';
import { MessageCard } from '@/components/messages/message-card';
import { Button } from '@/components/ui/button';
import { useSession } from '@/context/session-context.client';
import { useSocket } from '@/context/socket-context';
import useMessage from '@/hooks/use-message';
import ProtectedElement from '@/layout/protected-element';
import { useI18n } from '@/i18n/client';

import { MemberPanel, MemberPanelProvider, MemberPanelTrigger } from '@/app/[locale]/(user)/chat/member-pannel';
import { PaperclipIcon, SearchIcon, SendIcon, SmileIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { useMediaQuery } from 'usehooks-ts';

export default function Page() {
  const { state } = useSocket();
  const { session } = useSession();

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
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
              {state !== 'connected' ? (
                <LoadingSpinner className="m-auto" />
              ) : (
                <div className="h-full w-full overflow-y-auto" ref={(ref) => setContainer(ref)}>
                  <MessageList
                    showNotification
                    className="flex h-full flex-col gap-1"
                    queryKey={['global']}
                    room="GLOBAL"
                    container={() => container}
                    params={{ size: 50 }}
                    noResult={<div className="flex h-full w-full items-center justify-center font-semibold">{"Let's start a conversation"}</div>}
                  >
                    {(data) => <MessageCard key={data.id} message={data} />}
                  </MessageList>
                </div>
              )}
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
    <form className="flex h-14 flex-1 gap-2 border-t px-2 py-2" name="text" onSubmit={handleFormSubmit}>
      <div className="flex w-full items-center gap-2 rounded-md border bg-background px-2">
        <input className="h-full w-full bg-transparent outline-none" value={message} onChange={(event) => setMessage(event.currentTarget.value)} />
        <PaperclipIcon />
        <SmileIcon />
      </div>
      <Button className="h-full" variant="outline" type="submit" title={t('send')} disabled={state !== 'connected' || !message}>
        <SendIcon />
      </Button>
    </form>
  );
}
