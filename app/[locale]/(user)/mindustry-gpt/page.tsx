'use client';

import { SendIcon } from 'lucide-react';
import React, { Fragment, KeyboardEvent, useEffect, useState } from 'react';

import LoginButton from '@/components/button/login-button';
import Markdown from '@/components/common/markdown';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user/user-avatar';
import env from '@/constant/env';
import { useSession } from '@/context/session-context';
import useMindustryGpt from '@/hooks/use-mindustry-gpt';
import ProtectedElement from '@/layout/protected-element';
import { isReachedEnd } from '@/lib/utils';
import { useI18n } from '@/locales/client';

const url = `${env.url.api}/mindustry-gpt/chat`;

export default function Page() {
  const t = useI18n();
  const { session } = useSession();

  const [submit, { data, isPending, isLoading }] = useMindustryGpt({
    url,
  });

  const [reset, setReset] = useState(0);
  const { session: user } = useSession();
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

  function handleKeyPress(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className="grid grid-rows-[1fr,auto,auto] h-full p-2 overflow-hidden gap-2">
      <div className="p-2 h-full overflow-y-auto space-y-4 flex flex-col">
        {data.length === 0 && !isLoading ? (
          <div className="font-bold text-center h-full flex justify-center items-center">
            {t('chat.message')}
          </div>
        ) : (
          data.map(({ text, prompt }, index) => (
            <Fragment key={index}>
              <div className="flex justify-end">
                <span className="rounded-lg shadow-lg bg-card px-4 py-2">
                  {prompt}
                </span>
              </div>
              <div className="border rounded-lg shadow-lg p-4 space-y-2">
                {user && <UserAvatar user={user} />}
                <Markdown>{text}</Markdown>
              </div>
            </Fragment>
          ))
        )}

        {isLoading && (
          <Skeleton className="h-60 min-h-60 w-full rounded-lg"></Skeleton>
        )}
        <div id="bottom"></div>
      </div>
      <ProtectedElement
        session={session}
        alt={
          <div className="h-full w-full text-center whitespace-nowrap">
            <LoginButton className="justify-center bg-brand">
              Login to chat
            </LoginButton>
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 border rounded-md mx-auto items-end p-2 w-dvw md:w-2/3">
            <div
              key={reset}
              className="min-h-full focus-visible:outline-none max-h-56 overflow-y-auto overflow-x-hidden w-full max-w-[100vw] p-1"
              contentEditable
              role="textbox"
              data-placeholder={t('chat.input-place-holder')}
              //@ts-expect-error react error
              onInput={(event) => setPrompt(event.target.textContent ?? '')}
              onKeyDown={handleKeyPress}
            />
            <Button
              title={t('submit')}
              variant="primary"
              disabled={isPending}
              onClick={handleSubmit}
            >
              <SendIcon className="w-5 h-5" />
            </Button>
          </div>
          <div className="text-xs text-center">{t('chat.notice')}</div>
        </div>
      </ProtectedElement>
    </div>
  );
}
