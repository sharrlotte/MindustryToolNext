'use client';

import React from 'react';
import { toast } from 'sonner';

import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';

import { revalidate } from '@/action/action';
import useClientApi from '@/hooks/use-client';
import { startInternalServer } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type Props = {
  id: string;
};

export default function StartServerButton({ id }: Props) {
  const axios = useClientApi();

  const { mutate, isPending } = useMutation({
    mutationKey: ['internal-servers'],
    mutationFn: () => startInternalServer(axios, id),
    onSuccess: () => {
      toast.success(<Tran text="server.start-success" />);
    },
    onError: (error) => toast.error(<Tran text="server.start-fail" />, { description: error.message }),
    onSettled: () => {
      revalidate({ path: '/servers' });
    },
  });

  return (
    <Button className="w-20" title="Start" variant="primary" disabled={isPending} onClick={() => mutate()}>
      <Tran text="server.start" />
    </Button>
  );
}
