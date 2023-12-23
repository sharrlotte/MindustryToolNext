import { UserRole } from '@/types/response/User';
import { User } from 'next-auth';

export default interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
  roles: UserRole[]
  expireTime: Date;
}
