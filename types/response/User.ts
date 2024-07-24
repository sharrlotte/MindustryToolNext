import { Role } from '@/types/response/Role';

export type UserId = '@me' | string;
export interface User {
  id: string;
  name: string;
  imageUrl?: string | null;
  roles: Role[];
}
