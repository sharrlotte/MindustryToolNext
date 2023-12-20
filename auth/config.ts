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
      if (authProvider && authAccessToken && !session.user.id) {
        const result = await getMe({
          authAccessToken,
          authProvider,
        });

        if (result) {
          const { user, accessToken, refreshToken } = result;
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

type GetMeType = {
  authProvider: string;
  authAccessToken: string;
};

const getMe = unstable_cache(
  async ({ authProvider, authAccessToken }: GetMeType) => {
    const data: FormData = new FormData();

    data.append('provider', authProvider);
    data.append('accessToken', authAccessToken);

    try {
      const result: AuthResult = await fetch(`${env.url.api}/auth/login`, {
        method: 'POST',
        body: data,
        cache: 'reload',
      })
        .then((response) => response.text())
        .then((data) => (data ? JSON.parse(data) : {}));

      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  ['me'],
);
