import { useId, useRef, useState } from 'react';

import { useToast } from '@/hooks/use-toast';

import { useMutation } from '@tanstack/react-query';

type MindustryGptConfig = {
  url: string;
};

let count = 0;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const decoder = new TextDecoder();
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

  for (let i = 0; i < 10000; i++) {
    const { done, value } = await reader.read();

    if (done) return;

    let token = decoder.decode(value).replaceAll('data:', '');
    token = token.endsWith('\n\n') ? token.slice(0, token.length - 2) : token;

    for (const t of token) {
      await sleep(10);
      yield t;
    }

    if (signal?.aborted) {
      await reader.cancel();
      return;
    }
  }
}

export default function useMindustryGpt({ url }: MindustryGptConfig) {
  const id = useId();
  const requestId = useRef(0);

  const { toast } = useToast();
  const [data, setData] = useState<Map<number, string>>(new Map());

  const [abortController, setAbortController] =
    useState<AbortController | null>();

  const { mutate, error, isPending } = useMutation({
    mutationKey: ['completion', id],
    mutationFn: async (prompt: string) => {
      requestId.current = requestId.current + 1;

      if (abortController) {
        abortController.abort();
      }
      const controller = new AbortController();
      const signal = controller.signal;
      setAbortController(controller);

      for await (const token of getChat(url, prompt, signal)) {
        const current = data.get(requestId.current);

        if (current) {
          data.set(requestId.current, current + token);
        } else {
          data.set(requestId.current, token);
        }

        setData(new Map(data));
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

  return [
    mutate,
    {
      data: Array.from(data.entries())
        .sort((a, b) => a[0] - b[0])
        .map((a) => a[1]),
      error,
      isPending,
      isLoading: !data.get(requestId.current) && requestId.current !== 0,
    },
  ] as const;
}
