import { useId, useState } from 'react';

import { useToast } from '@/hooks/use-toast';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type MindustryGptConfig = {
  url: string;
};

export default function useMindustryGpt({ url }: MindustryGptConfig) {
  const id = useId();

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data } = useQuery<string>({
    queryKey: ['completion', id],
  });

  async function* getChat(url: string, prompt: string, signal: AbortSignal) {
    const requestUrl = new URL(url);
    requestUrl.searchParams.append('prompt', prompt);

    const res = await fetch(requestUrl, {
      method: 'GET',
      signal,
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(res.statusText + (await res.text()));
    }

    const reader = res.body?.getReader();

    if (!reader) throw new Error('No reader');

    const decoder = new TextDecoder();

    for (let i = 0; i < 10000; i++) {
      const { done, value } = await reader.read();

      if (done) return;

      const token = decoder.decode(value);
      yield token;

      if (signal?.aborted) {
        await reader.cancel();
        return;
      }
    }
  }

  const [abortController, setAbortController] =
    useState<AbortController | null>();

  const { mutate, error, isPending } = useMutation({
    mutationKey: ['completion', id],
    mutationFn: async (prompt: string) => {
      if (abortController) {
        abortController.abort();
      }
      const controller = new AbortController();
      const signal = controller.signal;
      setAbortController(controller);

      for await (const token of getChat(url, prompt, signal)) {
        queryClient.setQueryData<string>(['completion', id], (prev) =>
          prev ? prev + token : token,
        );
      }
      setAbortController(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return [mutate, { data, error, isPending }] as const;
}
