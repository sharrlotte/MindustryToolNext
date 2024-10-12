'use client';

import React from 'react';

import { revalidate } from '@/action/action';
import { Button } from '@/components/ui/button';
import useClientApi from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';

import { useMutation } from '@tanstack/react-query';
import { startInternalServer } from '@/query/server';
import Tran from '@/components/common/tran';

type Props = {
  id: string;
};

export default function StartServerButton({ id }: Props) {
  const axios = useClientApi();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ['internal-servers'],
    mutationFn: () => startInternalServer(axios, id),
    onSuccess: () => {
      toast({
        title: <Tran text="server.start-success" />,
        variant: 'success',
      });
    },
    onError: (error) =>
      toast({
        title: <Tran text="server.start-fail" />,
        description: error.message,
        variant: 'destructive',
      }),
    onSettled: () => {
      revalidate({ path: '/servers' });
    },
  });

  return (
    <Button
      className="w-20"
      title="Start"
      variant="primary"
      disabled={isPending}
      onClick={() => mutate()}
    >
      <Tran text="server.start" />
    </Button>
  );
}
