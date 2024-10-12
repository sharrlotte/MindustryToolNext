import { Authority, Role } from '@/types/response/Role';

export type UserId = '@me' | string;
export type User = {
  id: string;
  name: string;
  imageUrl?: string | null;
  thumbnail?: string | null;
  roles: Role[];
  authorities: Authority[];
  stats?: {
    EXP: number;
  };
};
