'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { Like } from '@/types/response/Like';
import React, { useState } from 'react';
import { ReactNode } from 'react';
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { LikeAction, LikeTarget } from '@/constant/enum';
import { useMutation } from '@tanstack/react-query';
import postLike from '@/query/like/post-like';
import useClientAPI from '@/hooks/use-client';
import { match } from 'assert';

type LikeData = Like & { count: number };

type LikeContextType = {
  likeData: LikeData;
  isLoading: boolean;
  handleLike: () => void;
  handleDislike: () => void;
};

const FakeLike: LikeData = {
  userId: '',
  targetId: '',
  state: 0,
  count: 0,
};

const defaultContextValue: LikeContextType = {
  likeData: FakeLike,
  isLoading: false,
  handleLike: () => {},
  handleDislike: () => {},
};

const LikeContext = React.createContext(defaultContextValue);

const useLike = () => React.useContext(LikeContext);

type LikeComponentProps = {
  children: ReactNode;
  initialLikeCount: number;
  initialLikeData: Like;
  targetType: LikeTarget;
  targetId: string;
};

function LikeComponent({
  initialLikeCount = 0,
  initialLikeData,
  children,
  targetType,
  targetId,
}: LikeComponentProps) {
  const { data: session, status } = useSession();
  const { axios } = useClientAPI();
  const [likeData, setLikeData] = useState({
    ...(initialLikeData ?? FakeLike),
    count: initialLikeCount,
  });
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (action: LikeAction) =>
      await postLike(axios, {
        action,
        targetType,
        targetId,
      }),
  });

  const requireLogin = () => {
    toast({
      title: 'You are not logged in',
      description: 'Login in to like post',
    });
  };

  const handleLike = () => {
    if (isPending) {
      return;
    }

    if (status !== 'authenticated' || !session?.user) {
      return requireLogin();
    }

    const change = likeData.state === -1 ? 2 : likeData.state === 0 ? 1 : -1;
    const state = likeData.state === -1 ? 1 : likeData.state === 0 ? 1 : 0;

    setLikeData({
      ...likeData,
      state,
      count: likeData.count + change,
    });
    return mutate('LIKE', {
      onError: () => setLikeData({ ...likeData }),
      onSuccess: (result) =>
        setLikeData({ count: likeData.count + result.amount, ...result.like }),
    });
  };

  const handleDislike = () => {
    if (isPending) {
      return;
    }

    if (status !== 'authenticated' || !session?.user) {
      return requireLogin();
    }

    const change = likeData.state === 1 ? 2 : likeData.state === 0 ? 1 : -1;
    const state = likeData.state === 1 ? -1 : likeData.state === 0 ? -1 : 0;

    setLikeData({
      ...likeData,
      state,
      count: likeData.count - change,
    });

    return mutate('DISLIKE', {
      onError: () => setLikeData({ ...likeData }),
      onSuccess: (result) =>
        setLikeData({ count: likeData.count + result.amount, ...result.like }),
    });
  };

  return (
    <LikeContext.Provider
      value={{
        likeData,
        isLoading: status === 'loading' || isPending,
        handleLike,
        handleDislike,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
}

type LikeButtonProps = ButtonProps;

function LikeButton({ className, ...props }: LikeButtonProps) {
  const { handleLike, likeData, isLoading } = useLike();

  return (
    <Button
      className={cn('p-2 hover:bg-success', className, {
        'bg-success hover:bg-success': likeData?.state === 1,
      })}
      {...props}
      disabled={isLoading}
      onClick={handleLike}
    >
      <ChevronDoubleUpIcon className="h-6 w-6" />
    </Button>
  );
}

function DislikeButton({ className, ...props }: LikeButtonProps) {
  const { handleDislike, likeData, isLoading } = useLike();
  return (
    <Button
      className={cn('p-2 hover:bg-destructive', className, {
        'bg-destructive hover:bg-destructive': likeData?.state === -1,
      })}
      {...props}
      disabled={isLoading}
      onClick={handleDislike}
    >
      <ChevronDoubleDownIcon className="h-6 w-6" />
    </Button>
  );
}
function LikeCount({ className, ...props }: LikeButtonProps) {
  const { likeData } = useLike();
  const { count } = likeData;

  return (
    <Button
      className={cn(className, {
        'text-destructive hover:text-destructive': count < 0,
        'text-success hover:text-success': count > 0,
      })}
      {...props}
    >
      {count}
    </Button>
  );
}

LikeComponent.LikeButton = LikeButton;
LikeComponent.DislikeButton = DislikeButton;
LikeComponent.LikeCount = LikeCount;

export default LikeComponent;
