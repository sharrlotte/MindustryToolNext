import { create } from 'zustand';

type VerifyCount = {
  schematicCount: number;
  mapCount: number;
  postCount: number;
  pluginCount: number;
  set: (data: Partial<VerifyCount>) => void;
};

export const useVerifyCount = create<VerifyCount>((set) => ({
  schematicCount: 0,
  mapCount: 0,
  postCount: 0,
  pluginCount: 0,
  set: (data: Partial<VerifyCount>) => set(data),
}));
