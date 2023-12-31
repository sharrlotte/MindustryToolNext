import { UserRole } from '@/constant/enum';

export default interface User {
  id: string;
  name: string;
  imageUrl: string;
  role: UserRole[];
  accessToken: string;
  refreshToken: string;
  expireTime: number;
}
