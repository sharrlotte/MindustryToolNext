import { DiscordIcon, GoogleIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import env from '@/constant/env';
import React from 'react';

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="grid gap-2">
        <a
          className="flex items-center justify-start gap-1 rounded-md border bg-[rgb(88,101,242)] p-2"
          href={`${env.url.api}/oauth2/discord`}
        >
          <DiscordIcon /> <Tran text="login.continue-with-discord" />
        </a>
        <a
          className="flex items-center justify-start gap-1 rounded-md border bg-white p-2 text-gray-800"
          href={`${env.url.api}/oauth2/google`}
        >
          <GoogleIcon /> <Tran text="login.continue-with-google" /> (Not support
          yet)
        </a>
      </div>
    </div>
  );
}
