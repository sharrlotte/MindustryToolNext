'use client';

import { SendIcon } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import env from '@/constant/env';
import useMindustryGpt from '@/hooks/use-mindustry-gpt';
import { useI18n } from '@/locales/client';

export default function Page() {
  const t = useI18n();
  const [submit, { data, isPending }] = useMindustryGpt({
    url: `${env.url.api}/mindustry-gpt/chat`,
  });

  const [prompt, setPrompt] = useState('');

  return (
    <div className="grid grid-rows-[1fr,auto] h-full p-4 overflow-hidden">
      <div className="p-2 h-full overflow-hidden">{data}</div>
      <div className="flex gap-2 border rounded-md mx-auto items-end p-1 w-dvw md:w-2/3">
        <div
          className="min-h-full focus-visible:outline-none max-h-56 overflow-y-auto overflow-x-hidden w-full max-w-[100vw] p-1"
          contentEditable
          role="textbox"
          //@ts-ignore
          onInput={(event) => setPrompt(event.target.textContent ?? '')}
        />
        <Button
          title={t('submit')}
          variant="primary"
          disabled={isPending}
          onClick={() => submit(prompt)}
        >
          <SendIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
