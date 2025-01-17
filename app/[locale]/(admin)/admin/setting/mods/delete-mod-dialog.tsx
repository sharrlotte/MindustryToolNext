import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import Tran from '@/components/common/tran';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteMod } from '@/query/mod';
import { Mod } from '@/types/response/Mod';

import { useMutation } from '@tanstack/react-query';

type Props = {
  mod: Mod;
};

export default function DeleteModDialog({ mod }: Props) {
  const { id, name } = mod;

  const axios = useClientApi();
  const { invalidateByKey } = useQueriesData();
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteMod(axios, id),
    onSuccess: () => {
      invalidateByKey(['mods']);
    },
  });

  return <DeleteButton isLoading={isPending} description={<Tran text="mode.delete-confirm" args={{ name }} />} onClick={mutate} variant="command" />;
}
