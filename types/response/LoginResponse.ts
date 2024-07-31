import { UserRole } from '@/constant/enum';

export type LoginResponse = {
  id: string;
  name: string;
  imageUrl?: string | null;
  roles: UserRole[];
  accessToken: string;
  refreshToken: string;
  expireTime: number;
};
