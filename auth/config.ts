import env from '@/constant/env';
import serverEnv from '@/constant/serverEnv';
import User from '@/types/response/User';
import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import { unstable_cache } from 'next/cache';

type AuthResult = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  pages: {
    error: '/auth/error',
  },
  providers: [
    Discord({
      clientId: serverEnv.oauth.discord.client_id,
      clientSecret: serverEnv.oauth.discord.client_secret,
    }),
  ],
  callbacks: {
    async session(params) {
      const { session, token } = params;

      const authProvider = token.provider as string;
      const authAccessToken = token.accessToken as string;

      // User id not present
      if (authProvider && authAccessToken && session.user && !session.user.id) {
        const apiUser = await getMe({ authAccessToken, authProvider });

        if (apiUser) {
          const { user, accessToken, refreshToken } = apiUser;
          session.user.id = user.id;
          session.user.accessToken = accessToken;
          session.user.refreshToken = refreshToken;
        }
      }

      return session;
    },
    async jwt(params) {
      const { token, account } = params;

      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      return token;
    },
  },
});

type GetMeParams = {
  authProvider: string;
  authAccessToken: string;
};

const getMe = async ({ authAccessToken, authProvider }: GetMeParams) => {
  const cacheFunc = unstable_cache(
    async () => {
      const data: FormData = new FormData();

      data.append('provider', authProvider);
      data.append('accessToken', authAccessToken);

      try {
        const result = await fetch(`${env.url.api}/auth/login`, {
          method: 'POST',
          body: data,
          cache: 'reload',
        });

        if (result.status != 200) {
          throw new Error('Failed to fetch user data from backend');
        }
        return (await result
          .text()
          .then((data) => (data ? JSON.parse(data) : {}))) as AuthResult;
      } catch (err) {
        console.error('Failed to login', err);
        return null;
      }
    },
    [authProvider, authAccessToken],
    {
      tags: [authProvider, authAccessToken],
      revalidate: 600,
    },
  );
  return await cacheFunc();
};
