import NextAuth, { DefaultSession } from 'next-auth';
import { User, Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      accessToken?: string;
      refreshToken?: string;
      expireTime: Date;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    accessToken?: string;
    refreshToken?: string;
  }

  interface JWT extends DefaultJWT  {
    accessToken?: string;
    provider: string;
  }
}
