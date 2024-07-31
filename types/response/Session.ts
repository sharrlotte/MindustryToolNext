import { Role } from '@/types/response/Role';

export type Session = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  roles: Role[];
  provider: string;
  providerId: string;
  lastLogin: number;
  createdAt: number;
};
