import { Role } from '@/types/response/Role';

export type Session = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  roles: Role[];
  authorities: string[];
  lastLogin: number;
  createdAt: number;
  stats: {
    EXP: number;
  };
};
