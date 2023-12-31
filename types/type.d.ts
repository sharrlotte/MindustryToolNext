import { UserRole } from '@/types/response/User';
import NextAuth, { DefaultSession } from 'next-auth';
import { User, Session, JWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string;
      accessToken?: string;
      expireTime: number;
      imageUrl: string;
      role: UserRole[];
    } & DefaultSession['user'];
  }

  interface JWT {
    accessToken?: string;
    provider: string;
  }
}
