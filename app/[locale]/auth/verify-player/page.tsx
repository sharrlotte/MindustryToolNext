'use client';

import RouterSpinner from '@/components/common/router-spinner';
import Tran from '@/components/common/tran';
import useClientApi from '@/hooks/use-client';
import useSafeSearchParams from '@/hooks/use-safe-search-params';
import { useToast } from '@/hooks/use-toast';
import { verifyPlayer } from '@/query/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Page() {
  const params = useSafeSearchParams();
  const token = params.get('token');

  if (!token) {
    <div className="flex h-full items-center justify-center text-3xl font-bold text-success">
      <Tran text="token.invalid" />
    </div>;
  }

  return <Verify token={token} />;
}

function Verify({ token }: { token: string }) {
  const axios = useClientApi();
  const router = useRouter();

  const { toast } = useToast();

  const { mutate, status } = useMutation({
    mutationKey: ['verify-player'],
    mutationFn: (token: string) => verifyPlayer(axios, token),
    onError: (error) => {
      toast({
        title: <Tran text="token.verification-failed" />,
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  useEffect(() => mutate(token), [mutate, token]);

  if (status === 'idle') {
    return (
      <div className="flex h-full items-center justify-center text-3xl font-bold text-gray-500">
        <RouterSpinner />
      </div>
    );
  } else if (status === 'pending') {
    return (
      <div className="flex h-full flex-col items-center justify-center text-3xl font-bold text-gray-500">
        <Tran text="token.verifying" />
        <RouterSpinner />
      </div>
    );
  } else if (status === 'error') {
    router.push('/error');
  } else {
    router.push('/success');
  }

  return undefined;
}
