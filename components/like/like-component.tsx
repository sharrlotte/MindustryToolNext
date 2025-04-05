import { ReactNode, createContext, useCallback, useContext, useState } from 'react';
import React from 'react';

import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import { LikeAction } from '@/constant/enum';
import { useSession } from '@/context/session-context';
import useClientApi from '@/hooks/use-client';
import { postLike } from '@/query/like';
import { Like } from '@/types/response/Like';

import { useMutation, useQueryClient } from '@tanstack/react-query';

const DISLIKE = -1;
const LIKE = 1;
const UNSET = 0;

type LikeComponentContextType = {
  like: number;
  dislike: number;
  likeData: Like;
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
  const queryClient = useQueryClient();
  const { session } = useSession();
  const axios = useClientApi();
  const [likeData, setLikeData] = useState({
    data: initialLikeData ?? {
      userId: '',
      itemId,
      state: 0,
    },
    like: initialLikeCount,
    dislike: initialDislikeCount,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (action: LikeAction) =>
      await postLike(axios, {
        action,
        itemId,
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['like', itemId] }),
  });

  console.log(likeData);

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
        if (likeData.data.state === LIKE) {
          likeChange = -1;
          state = UNSET;
        } else if (likeData.data.state === DISLIKE) {
          likeChange = 1;
          dislikeChange = -1;
          state = LIKE;
        } else {
          likeChange = 1;
          state = LIKE;
        }
      } else {
        if (likeData.data.state === DISLIKE) {
          dislikeChange = -1;
          state = UNSET;
        } else if (likeData.data.state === LIKE) {
          dislikeChange = 1;
          likeChange = -1;
          state = DISLIKE;
        } else {
          dislikeChange = 1;
          state = DISLIKE;
        }
      }

      likeData.data.state = state;

      setLikeData({
        data: { ...likeData.data, state },
        like: likeData.like + likeChange,
        dislike: likeData.dislike + dislikeChange,
      });

      return mutate(action, {
        onError: () => {
          setLikeData({ ...likeData });
        },
        onSuccess: () => {
          setLikeData({
            data: { ...likeData.data, state },
            like: likeData.like + likeChange,
            dislike: likeData.dislike + dislikeChange,
          });
        },
      });
    },
    [isPending, likeData, mutate, session],
  );

  const contextValue = {
    like: likeData.like,
    dislike: likeData.dislike,
    likeData: likeData.data,
    isLoading: isPending,
    handleAction,
  };

  return <LikeComponentContext.Provider value={contextValue}>{children}</LikeComponentContext.Provider>;
}
