'use client';

import React from 'react';

import { revalidate } from '@/action/action';
import { Button } from '@/components/ui/button';
import useClientApi from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';

import { useMutation } from '@tanstack/react-query';
import { startInternalServers } from '@/query/server';
import Tran from '@/components/common/tran';

type Props = {
  id: string;
};

export default function StartServerButton({ id }: Props) {
  const axios = useClientApi();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ['internal-server, internal-servers'],
    mutationFn: () => startInternalServers(axios, id),
    onSuccess: () => {
      toast({
        title: 'Start server successfully',
        variant: 'success',
      });
    },
    onError: (error) =>
      toast({
        title: 'Start server failed',
        description: error.message,
        variant: 'destructive',
      }),
    onSettled: () => {
      revalidate('/servers');
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
