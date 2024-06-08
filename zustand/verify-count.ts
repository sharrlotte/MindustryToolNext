import { create } from 'zustand';

type VerifyCount = {
  schematicCount: number;
  mapCount: number;
  postCount: number;
  set: (data: Partial<VerifyCount>) => void;
};

export const useVerifyCount = create<VerifyCount>((set, get) => ({
  schematicCount: 0,
  mapCount: 0,
  postCount: 0,
  set: (data: Partial<VerifyCount>) => set(data),
}));
