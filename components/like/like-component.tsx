"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Like } from "@/types/Like";
import React, { useState } from "react";
import { ReactNode } from "react";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type LikeContextType = {
  likeData: Like;
  likeCount: number;
  isLoading: boolean;
  isError: boolean;
  handleLike: () => Like;
  handleDislike: () => Like;
};

const FakeLike: Like = {
  userId: "",
  targetId: "",
  state: 0,
};

const defaultContextValue: LikeContextType = {
  likeData: FakeLike,
  likeCount: 0,
  isLoading: false,
  isError: false,
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
  initialLikeCount,
  initialLikeData,
  children,
}: LikeComponentProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likeData, setLikeData] = useState(initialLikeData);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const { toast } = useToast();

  const handleLike = () => {
    toast({
      title: "It does nothing",
    });
    return FakeLike;
  };
  const handleDislike = () => {
    toast({
      title: "It does nothing",
    });
    return FakeLike;
  };

  return (
    <LikeContext.Provider
      value={{
        likeData,
        likeCount,
        isLoading,
        isError,
        handleLike,
        handleDislike,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
}

type LikeButtonProps = ButtonProps;

function LikeButton(props: LikeButtonProps) {
  const { handleLike } = useLike();

  return (
    <Button {...props} onClick={handleLike}>
      <ChevronDoubleUpIcon className="h-8 w-6" />
    </Button>
  );
}

function DislikeButton(props: LikeButtonProps) {
  const { handleDislike } = useLike();
  return (
    <Button {...props} onClick={handleDislike}>
      <ChevronDoubleDownIcon className="h-8 w-6" />
    </Button>
  );
}
function LikeCount({ className, ...props }: LikeButtonProps) {
  const { likeCount } = useLike();

  return (
    <Button
      className={cn(className, {
        "text-destructive hover:text-destructive": likeCount < 0,
        "text-success hover:text-success": likeCount > 0,
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
