'use client';

import { notFound } from 'next/navigation';
import React, { use, useState } from 'react';

import { EyeIcon, EyeOffIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/router-spinner';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import useClientApi from '@/hooks/use-client';
import useClipboard from '@/hooks/use-clipboard';
import { getMyServerManagerById } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

type Props = {
  params: Promise<{ id: string }>;
};
export default function Page({ params }: Props) {
  const { id } = use(params);

  const [showAccessToken, setShowAccessToken] = useState(false);
  const [showSecurityKey, setShowSecurityKey] = useState(false);
  const axios = useClientApi();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['server-manager', id],
    queryFn: () => getMyServerManagerById(axios, id),
  });

  const copy = useClipboard();

  function handleCopy(data: string) {
    copy({ data, title: 'copied' });
  }

  if (isError) {
    <div className="col-span-full flex h-full flex-col w-full items-center text-center justify-center">
      <Tran className="font-semibold" text="error" />
      <p className="text-muted-foreground">{JSON.stringify(error)}</p>
    </div>;
  }

  if (isLoading) {
    return (
      <div className="grid w-full h-full items-center grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return notFound();
  }

  const { name, address, accessToken, securityKey } = data;

  return (
    <div className="grid p-2 space-y-2">
      <h1>{name}</h1>
      <p className="text-sm text-muted-foreground">{address}</p>
      <Tran text="server.security-key" />
      <div className="flex gap-2">
        <Input className="w-80 cursor-pointer text-muted-foreground" value={showSecurityKey ? securityKey : '**********************************************'} onClick={() => handleCopy(securityKey)} />
        <Button onClick={() => setShowSecurityKey((prev) => !prev)} variant="ghost">
          {showSecurityKey ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
      <Tran text="server.access-token" />
      <div className="flex gap-2">
        <Textarea
          className="w-80 min-h-36 cursor-pointer text-muted-foreground"
          value={showAccessToken ? accessToken : '****************************************************************************************'}
          onClick={() => handleCopy(accessToken)}
        />
        <Button onClick={() => setShowAccessToken((prev) => !prev)} variant="ghost">
          {showAccessToken ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    </div>
  );
}
