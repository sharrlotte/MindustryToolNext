import { User } from 'next-auth';

export default interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
  expireTime: Date;
}
