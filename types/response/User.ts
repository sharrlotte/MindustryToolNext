import { UserRole } from '@/constant/enum';

export interface User {
  id: string;
  name: string;
  image: string;
  roles: UserRole[];
  accessToken: string;
  refreshToken: string;
  expireTime: number;
}
