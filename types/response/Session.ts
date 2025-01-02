import { Role } from '@/types/response/Role';
import { UserStats } from '@/types/response/User';

export type Session = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  roles: Role[];
  authorities: string[];
  lastLogin: number;
  createdAt: number;
  stats: UserStats;
  isBanned: boolean;
};
