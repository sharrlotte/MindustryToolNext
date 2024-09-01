'use client';

import Tran from '@/components/common/tran';
import { Input } from '@/components/ui/input';
import useClientAPI from '@/hooks/use-client';
import { useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import React, { useState } from 'react';

async function toggleDebug(
  axios: AxiosInstance,
  value: boolean,
): Promise<{ data: boolean }> {
  return await axios.post(`/debug`, null, {
    params: {
      value,
    },
  });
}

export default function Page() {
  const [value, setValue] = useState<boolean>(false);
  const axios = useClientAPI();

  const { mutate, isPending } = useMutation({
    mutationKey: ['debug'],
    mutationFn: async (value: boolean) => toggleDebug(axios, value),
    onSuccess: (data) => setValue(data.data),
    onError: (error) => console.error('Failed to update user:', error),
  });

  function handleChange(data: boolean) {
    mutate(data);
    setValue(data);
  }

  return (
    <div className="flex items-center gap-1 p-4">
      <Input
        className="aspect-square w-4"
        type="checkbox"
        checked={value}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.checked)}
      />
      <Tran text="setting.debug" />
    </div>
  );
}
