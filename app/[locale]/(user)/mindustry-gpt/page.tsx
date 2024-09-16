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
import { useI18n } from '@/i18n/client';
import Tran from '@/components/common/tran';

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
    <div className="grid h-full grid-rows-[1fr,auto,auto] gap-2 overflow-hidden p-2">
      <div className="flex h-full flex-col space-y-4 overflow-y-auto p-2">
        {data.length === 0 && !isLoading ? (
          <div className="flex h-full items-center justify-center text-center font-bold">
            {t('chat.message')}
          </div>
        ) : (
          data.map(({ text, prompt }, index) => (
            <Fragment key={index}>
              <div className="flex justify-end">
                <span className="rounded-lg bg-card px-4 py-2 shadow-lg">
                  {prompt}
                </span>
              </div>
              <div className="space-y-2 rounded-lg border p-4 shadow-lg">
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
          <div className="h-full w-full whitespace-nowrap text-center">
            <LoginButton className="justify-center bg-brand">
              <Tran text="mindustry-gpt.require-login" />
            </LoginButton>
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <div className="mx-auto flex w-dvw items-end gap-2 rounded-md border p-2 md:w-2/3">
            <div
              key={reset}
              className="max-h-56 min-h-full w-full max-w-[100vw] overflow-y-auto overflow-x-hidden p-1 focus-visible:outline-none"
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
              <SendIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center text-xs">{t('chat.notice')}</div>
        </div>
      </ProtectedElement>
    </div>
  );
}
