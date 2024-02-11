import { UserRole } from '@/constant/enum';
import NextAuth, { User, Session, DefaultSession, DefaultJWT } from 'next-auth';
import { JWT, DefaultJWT } from '@auth/core/types';

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string;
      accessToken?: string;
      roles: UserRole[];
      name: string;
      imageUrl?: string | null;
      expireAt: number;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId: string;
    roles: UserRole[];
    version: number;
    accessToken: string;
    expireAt: number;
  }
}

declare global {
  type QueryKey =
    | 'schematics'
    | 'maps'
    | 'posts'
    | 'schematic-uploads'
    | 'map-uploads'
    | 'post-uploads'
    | 'total-schematic-uploads'
    | 'total-map-uploads'
    | 'total-post-uploads'
    | 'servers';

  type TQueryKey = QueryKey;
}
