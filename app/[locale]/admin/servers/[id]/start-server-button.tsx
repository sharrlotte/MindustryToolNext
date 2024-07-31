'use client';

import React from 'react';

import { revalidate } from '@/action/action';
import { Button } from '@/components/ui/button';
import useClientAPI from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import postStartInternalServers from '@/query/server/post-start-internal-server';

import { useMutation } from '@tanstack/react-query';

type Props = {
  id: string;
};

export default function StartServerButton({ id }: Props) {
  const axios = useClientAPI();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ['internal-server, internal-servers'],
    mutationFn: () => postStartInternalServers(axios, id),
    onSuccess: () => {
      toast({
        title: 'Start server successfully',
        variant: 'success',
      });
      revalidate('/admin/servers');
    },
    onError: (error) =>
      toast({
        title: 'Start server failed',
        description: error.message,
        variant: 'destructive',
      }),
  });

  return (
    <Button
      className="w-20"
      title="Start"
      variant="primary"
      disabled={isPending}
      onClick={() => mutate()}
    >
      Start
    </Button>
  );
}
