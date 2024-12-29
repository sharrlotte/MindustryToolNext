'use client';

import React, { useCallback, useMemo } from 'react';
import { ReactNode } from 'react';
import { create } from 'zustand';

import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import { LikeAction } from '@/constant/enum';
import { FakeLike, LikeContext } from '@/context/like-context';
import { useSession } from '@/context/session-context.client';
import useClientApi from '@/hooks/use-client';
import { postLike } from '@/query/like';
import { Like } from '@/types/response/Like';

import { useMutation } from '@tanstack/react-query';

const DISLIKE = -1;
const LIKE = 1;
const UNSET = 0;

type State = {
  cache: Record<string, Like & { like: number; dislike: number }>;
  setCache: (id: string, data: Like & { like: number; dislike: number }) => void;
};

const useCache = create<State>((set) => ({
  cache: {},
  setCache: (id: string, data: Like & { like: number; dislike: number }) => set((prev) => ({ cache: { ...prev.cache, [id]: data } })),
}));

type LikeComponentProps = {
  children: ReactNode;
  initialLikeCount: number;
  initialDislikeCount: number;
  initialLikeData?: Like;
  itemId: string;
};

function LikeComponent({ initialLikeCount = 0, initialDislikeCount = 0, initialLikeData, children, itemId }: LikeComponentProps) {
  const { session } = useSession();
  const axios = useClientApi();
  const { cache, setCache } = useCache();
  const likeData = useMemo(
    () => ({
      ...(cache[itemId] ?? {
        ...(initialLikeData ?? FakeLike),
        like: initialLikeCount,
        dislike: initialDislikeCount,
      }),
    }),
    [cache, initialLikeCount, initialDislikeCount, initialLikeData, itemId],
  );

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
        return toast(<Tran text="like.require-login" />);
      }

      let likeChange: number = 0;
      let dislikeChange: number = 0;
      let state: 0 | 1 | -1;

      if (action === 'LIKE') {
        if (likeData.state === LIKE) {
          likeChange = -1;
          state = UNSET;
        } else if (likeData.state === DISLIKE) {
          likeChange = 1;
          dislikeChange = -1;
          state = LIKE;
        } else {
          likeChange = 1;
          state = LIKE;
        }
      } else {
        if (likeData.state === DISLIKE) {
          dislikeChange = -1;
          state = UNSET;
        } else if (likeData.state === LIKE) {
          dislikeChange = 1;
          likeChange = -1;
          state = DISLIKE;
        } else {
          dislikeChange = 1;
          state = DISLIKE;
        }
      }

      likeData.state = state;

      setCache(itemId, {
        ...likeData,
        state,
        like: likeData.like + likeChange,
        dislike: likeData.dislike + dislikeChange,
      });

      return mutate(action, {
        onError: () => setCache(itemId, { ...likeData }),
        onSuccess: (result) => {
          setCache(itemId, {
            like: likeData.like + result.amountLike,
            dislike: likeData.dislike + result.amountDislike,
            ...result.like,
          });
        },
      });
    },
    [isPending, itemId, likeData, mutate, session, setCache],
  );

  return (
    <LikeContext.Provider
      value={{
        like: cache[itemId]?.like ?? initialLikeCount,
        dislike: cache[itemId]?.dislike ?? initialDislikeCount,
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
