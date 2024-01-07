import { UserRole } from '@/constant/enum';
import NextAuth, { User, Session, DefaultSession, DefaultJWT } from 'next-auth';
import { JWT, DefaultJWT } from '@auth/core/jwt';

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string;
      accessToken?: string;
      roles: UserRole[];
      name: string;
      image: string;
    } & DefaultSession['user'];
  }
}

declare module '@auth/core/jwt' {
  interface JWT extends DefaultJWT {
    userId: string;
    roles: UserRole[];
    version: number;
    accessToken: string;
  }
}
