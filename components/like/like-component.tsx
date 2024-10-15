'use client';

import React, { useCallback, useMemo } from 'react';
import { ReactNode } from 'react';

import { LikeAction } from '@/constant/enum';
import { FakeLike, LikeContext } from '@/context/like-context';
import { useSession } from '@/context/session-context.client';
import useClientApi from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import { Like } from '@/types/response/Like';

import { useMutation } from '@tanstack/react-query';
import { postLike } from '@/query/like';
import Tran from '@/components/common/tran';
import { create } from 'zustand';

type State = {
  cache: Record<string, Like & { count: number }>;
  setCache: (id: string, data: Like & { count: number }) => void;
};

const useCache = create<State>((set) => ({
  cache: {},
  setCache: (id: string, data: Like & { count: number }) => set((prev) => ({ cache: { ...prev.cache, [id]: data } })),
}));

type LikeComponentProps = {
  children: ReactNode;
  initialLikeCount: number;
  initialLikeData?: Like;
  itemId: string;
};

function LikeComponent({ initialLikeCount = 0, initialLikeData, children, itemId }: LikeComponentProps) {
  const { session } = useSession();
  const axios = useClientApi();
  const { cache, setCache } = useCache();
  const likeData = useMemo(
    () => ({
      ...(cache[itemId] ?? {
        ...(initialLikeData ?? FakeLike),
        count: initialLikeCount,
      }),
    }),
    [cache, initialLikeCount, initialLikeData, itemId],
  );

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (action: LikeAction) =>
      await postLike(axios, {
        action,
        itemId,
      }),
  });

  const handleAction = useCallback(
    (action: 'LIKE' | 'DISLIKE') => {
      if (isPending) {
        return;
      }

      if (!session) {
        return toast({
          title: <Tran text="like.require-login" />,
        });
      }

      let change: -2 | -1 | 0 | 1 | 2;
      let state: 0 | 1 | -1;

      if (action === 'LIKE') {
        change = likeData.state === -1 ? 2 : likeData.state === 0 ? 1 : -1;
        state = likeData.state === -1 ? 1 : likeData.state === 0 ? 1 : 0;
      } else {
        change = likeData.state === 1 ? -2 : likeData.state === 0 ? -1 : 1;
        state = likeData.state === 1 ? -1 : likeData.state === 0 ? -1 : 0;
      }

      setCache(itemId, {
        ...likeData,
        state,
        count: likeData.count + change,
      });

      return mutate(action, {
        onError: () => setCache(itemId, { ...likeData }),
        onSuccess: (result) => {
          setCache(itemId, {
            count: likeData.count + result.amount,
            ...result.like,
          });
        },
      });
    },
    [isPending, itemId, likeData, mutate, session, setCache, toast],
  );

  return (
    <LikeContext.Provider
      value={{
        likeData,
        isLoading: isPending,
        handleAction,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
}

export default LikeComponent;
