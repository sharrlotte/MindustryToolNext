import { ReactNode, createContext, useCallback, useContext } from 'react';
import React from 'react';

import Tran from '@/components/common/tran';
import { LikeData } from '@/components/like/like-and-dislike';
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
  data: Like;
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
  itemId: string;
  data: LikeData;
};

export default function LikeComponent({ data, children, itemId }: LikeComponentProps) {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const axios = useClientApi();

  const { mutate, isPending } = useMutation({
    mutationFn: async (action: LikeAction) =>
      await postLike(axios, {
        action,
        itemId,
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['like', itemId] }),
  });

  const setData = useCallback(
    (newData: LikeData) => {
      queryClient.setQueriesData({ queryKey: ['like', itemId] }, () => {
        return newData;
      });
    },
    [itemId, queryClient],
  );

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
        if (data.data.state === LIKE) {
          likeChange = -1;
          state = UNSET;
        } else if (data.data.state === DISLIKE) {
          likeChange = 1;
          dislikeChange = -1;
          state = LIKE;
        } else {
          likeChange = 1;
          state = LIKE;
        }
      } else {
        if (data.data.state === DISLIKE) {
          dislikeChange = -1;
          state = UNSET;
        } else if (data.data.state === LIKE) {
          dislikeChange = 1;
          likeChange = -1;
          state = DISLIKE;
        } else {
          dislikeChange = 1;
          state = DISLIKE;
        }
      }

      data.data.state = state;

      setData({
        data: { ...data.data, state },
        like: data.like + likeChange,
        dislike: data.dislike + dislikeChange,
      });

      return mutate(action, {
        onError: () => {
          setData({ ...data });
        },
        onSuccess: () => {
          setData({
            data: { ...data.data, state },
            like: data.like + likeChange,
            dislike: data.dislike + dislikeChange,
          });
        },
      });
    },
    [isPending, session, data, setData, mutate],
  );

  const contextValue = {
    like: data.like,
    dislike: data.dislike,
    data: { ...data.data },
    isLoading: isPending,
    handleAction,
  };

  return <LikeComponentContext.Provider value={contextValue}>{children}</LikeComponentContext.Provider>;
}
