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

type LikeContextType = {
  likeData: Like;
  likeCount: number;
  isLoading: boolean;
  handleLike: () => Like;
  handleDislike: () => Like;
};

const FakeLike: Like = {
  userId: '',
  targetId: '',
  state: 0,
};

const defaultContextValue: LikeContextType = {
  likeData: FakeLike,
  likeCount: 0,
  isLoading: false,
  handleLike: () => FakeLike,
  handleDislike: () => FakeLike,
};

const LikeContext = React.createContext(defaultContextValue);

const useLike = () => React.useContext(LikeContext);

type LikeComponentProps = {
  children: ReactNode;
  initialLikeCount: number;
  initialLikeData: Like;
};

function LikeComponent({
  initialLikeCount = 0,
  initialLikeData = FakeLike,
  children,
}: LikeComponentProps) {
  const { data: session, status } = useSession();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likeData, setLikeData] = useState(initialLikeData);
  const { toast } = useToast();

  const requireLogin = () => {
    toast({
      title: 'You are not logged in',
      description: 'Login in to like post',
    });
  };

  const handleLike = () => {
    if (status === 'authenticated' && session?.user) {
    } else {
      requireLogin();
    }

    return FakeLike;
  };
  const handleDislike = () => {
    if (status === 'authenticated' && session?.user) {
    } else {
      requireLogin();
    }
    return FakeLike;
  };

  return (
    <LikeContext.Provider
      value={{
        likeData,
        likeCount,
        isLoading: status === 'loading',
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
  const { likeCount } = useLike();

  return (
    <Button
      className={cn(className, {
        'text-destructive hover:text-destructive': likeCount < 0,
        'text-success hover:text-success': likeCount > 0,
      })}
      {...props}
    >
      {likeCount}
    </Button>
  );
}

LikeComponent.LikeButton = LikeButton;
LikeComponent.DislikeButton = DislikeButton;
LikeComponent.LikeCount = LikeCount;

export default LikeComponent;
