'use client';

import React from 'react';

import { LikeData } from '@/types/data/LikeData';

type LikeContextType = {
  likeData: LikeData;
  isLoading: boolean;
  handleAction: (action: 'LIKE' | 'DISLIKE') => void;
};

export const FakeLike: LikeData = {
  userId: '',
  itemId: '',
  state: 0,
  count: 0,
};

const defaultContextValue: LikeContextType = {
  likeData: FakeLike,
  isLoading: false,
  handleAction: (action: 'LIKE' | 'DISLIKE') => {},
};

export const LikeContext = React.createContext(defaultContextValue);

export const useLike = () => React.useContext(LikeContext);
