'use client';

import { LikeData } from '@/types/data/LikeData';
import React from 'react';

type LikeContextType = {
  likeData: LikeData;
  isLoading: boolean;
  handleLike: () => void;
  handleDislike: () => void;
};

export const FakeLike: LikeData = {
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

export const LikeContext = React.createContext(defaultContextValue);

export const useLike = () => React.useContext(LikeContext);
