'use client';

import { Fragment, KeyboardEvent, useEffect, useState } from 'react';

import ChatInputField from '@/app/[locale]/(main)/mindustry-gpt/chat-input-field';

import LoginButton from '@/components/button/login-button';
import { SendIcon } from '@/components/common/icons';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import Markdown from '@/components/markdown/markdown';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user/user-avatar';

import env from '@/constant/env';
import { useSession } from '@/context/session-context';
import useMindustryGpt from '@/hooks/use-mindustry-gpt';
import ProtectedElement from '@/layout/protected-element';
import { isReachedEnd } from '@/lib/utils';

const url = `${env.url.api}/mindustry-gpt/chat`;

export default function GptPage() {
  const { session } = useSession();

  const [submit, { data, isPending }] = useMindustryGpt({
    url,
  });

  const [reset, setReset] = useState(0);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    const bottom = document.getElementById('bottom');
    if (bottom && isReachedEnd(bottom)) {
      bottom.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);

  function handleSubmit() {
    submit(prompt);
    setPrompt('');
    setReset(reset + 1);

    setTimeout(() => {
      document.getElementById('bottom')?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  }

  function handleKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className="grid h-full grid-rows-[1fr_auto_auto] gap-2 overflow-hidden p-2">
      <ScrollContainer className="flex h-full flex-col space-y-4 p-2">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center font-bold">
            <Tran text="chat.message" />
          </div>
        ) : (
          data.map(({ text, prompt }, index) => (
            <Fragment key={index}>
              <div className="flex justify-end">
                <span className="rounded-lg bg-card px-4 py-2 max-w-[70%] shadow-lg">{prompt}</span>
              </div>
              <div className="space-y-2 rounded-lg bg-card p-4 shadow-lg max-w-[70%]">
                {session && <UserAvatar user={session} />}
                {text ? <Markdown>{text}</Markdown> : <Skeleton className="h-10 min-h-10 w-full rounded-lg" />}
              </div>
            </Fragment>
          ))
        )}
        <div id="bottom" />
      </ScrollContainer>
      <ProtectedElement
        session={session}
        filter={true}
        alt={
          <div className="h-full w-full whitespace-nowrap text-center">
            <LoginButton className="justify-center bg-brand">
              <Tran text="mindustry-gpt.require-login" />
            </LoginButton>
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <div className="mx-auto flex w-full items-end gap-2 rounded-md border p-2 md:w-2/3">
            <ChatInputField reset={reset} handleKeyPress={handleKeyPress} setPrompt={setPrompt} />
            <Button title="submit" variant="primary" disabled={isPending} onClick={handleSubmit}>
              <SendIcon />
            </Button>
          </div>
          <div className="flex w-full items-center justify-center text-center text-xs">
            <Tran text="chat.notice" />
          </div>
        </div>
      </ProtectedElement>
    </div>
  );
}
