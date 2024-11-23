'use client';

import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import Tran from '@/components/common/tran';

import { revalidate } from '@/action/action';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';
import { deleteRole } from '@/query/role';
import { Role } from '@/types/response/Role';

import { useMutation } from '@tanstack/react-query';

type Props = {
  role: Role;
};

export default function DeleteRoleButton({ role }: Props) {
  const { name } = role;
  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ['roles'],
    mutationFn: () => deleteRole(axios, role.id),
    onSuccess: () => {
      toast({
        title: <Tran text="upload.success" />,
        variant: 'success',
      });
    },
    onError: (error) =>
      toast({
        title: <Tran text="upload.fail" />,
        description: error.message,
        variant: 'destructive',
      }),
    onSettled: () => {
      invalidateByKey(['roles']);
      revalidate({ path: '/users' });
    },
  });

  const t = useI18n();

  return <DeleteButton variant="command" isLoading={isPending} description={<Tran text="role.delete" args={{ name: t(name) }} />} onClick={mutate} />;
}
