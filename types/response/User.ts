import { UserRole } from '@/constant/enum';

export interface User {
  id: string;
  name: string;
  imageUrl: string;
  roles: UserRole[];
  accessToken: string;
  refreshToken: string;
  expireTime: number;
}
