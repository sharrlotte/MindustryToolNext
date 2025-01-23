import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';
import React from 'react';

import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import { LikeAction } from '@/constant/enum';
import { useSession } from '@/context/session-context.client';
import useClientApi from '@/hooks/use-client';
import { postLike } from '@/query/like';
import { LikeData } from '@/types/data/LikeData';
import { Like } from '@/types/response/Like';

import { useMutation } from '@tanstack/react-query';

export const FakeLike: LikeData = {
  userId: '',
  itemId: '',
  state: 0,
  like: 0,
  dislike: 0,
};

const DISLIKE = -1;
const LIKE = 1;
const UNSET = 0;

type LikeComponentContextType = {
  like: number;
  dislike: number;
  likeData: Like & { like: number; dislike: number };
  isLoading: boolean;
  handleAction: (action: 'LIKE' | 'DISLIKE') => void;
};

const LikeComponentContext = createContext<LikeComponentContextType | undefined>(undefined);

export function useLike() {
  const context = useContext(LikeComponentContext);
  if (!context) {
    throw new Error('useLikeComponent must be used within LikeComponent');
  }
  return context;
}

type LikeComponentProps = {
  children: ReactNode;
  initialLikeCount: number;
  initialDislikeCount: number;
  initialLikeData?: Like;
  itemId: string;
};

export default function LikeComponent({ initialLikeCount = 0, initialDislikeCount = 0, initialLikeData, children, itemId }: LikeComponentProps) {
  const { session } = useSession();
  const axios = useClientApi();
  const [cache, setCache] = useState<Record<string, Like & { like: number; dislike: number }>>({});
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
      console.log(action);
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

      setCache((prev) => ({
        ...prev,
        [itemId]: {
          ...likeData,
          state,
          like: likeData.like + likeChange,
          dislike: likeData.dislike + dislikeChange,
        },
      }));

      return mutate(action, {
        onError: () => {
          setCache((prev) => ({ ...prev, [itemId]: likeData }));
        },
        onSuccess: (result) => {
          setCache((prev) => ({
            ...prev,
            [itemId]: {
              like: likeData.like + result.amountLike,
              dislike: likeData.dislike + result.amountDislike,
              ...result.like,
            },
          }));
        },
      });
    },
    [isPending, itemId, likeData, mutate, session],
  );

  const contextValue = {
    like: cache[itemId]?.like ?? initialLikeCount,
    dislike: cache[itemId]?.dislike ?? initialDislikeCount,
    likeData,
    isLoading: isPending,
    handleAction,
  };

  return <LikeComponentContext.Provider value={contextValue}>{children}</LikeComponentContext.Provider>;
}
