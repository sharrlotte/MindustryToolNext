import * as globalEnv from '@/constant/env';
import serverEnv from '@/constant/serverEnv';
import RefreshTokenResponse from '@/types/response/RefreshTokenResponse';
import User from '@/types/response/User';
import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import { env } from 'process';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 60,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 60,
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

      const provider = token.provider as string | undefined;
      const providerId = token.providerId as string | undefined;

      // User id not present
      const name = session.user?.name ?? '';
      const image = session.user?.image ?? '';

      session.user = undefined;

      if (provider && providerId) {
        const user = await getUser({
          providerId,
          provider,
          name,
          image,
        });

        if (user) {
          session.user = user;
        } else {
          session.user = undefined;
        }
      } else {
        session.user = undefined;
      }

      if (
        session.user?.refreshToken &&
        session.user?.expireTime &&
        Number(session.user?.expireTime) <= Date.now()
      ) {
        const result = await refreshToken(session.user.refreshToken);
        if (result) {
          session.user.accessToken = result.accessToken;
          session.user.refreshToken = result.refreshToken;
          session.user.expireTime = result.expireTime;
        }
      }

      return session;
    },
    async jwt(params) {
      const { token, account } = params;

      if (account) {
        token.provider = account.provider;
        token.providerId = account.providerAccountId;
      }

      return token;
    },
  },
});

type GetMeParams = {
  provider: string;
  providerId: string;
  name: string;
  image: string;
};

const getUser = async ({ providerId, provider, name, image }: GetMeParams) => {
  const data: FormData = new FormData();

  data.append('provider', provider);
  data.append('providerId', providerId);
  data.append('name', name);
  data.append('image', image);

  if (
    !env.API_ACCESS_TOKEN ||
    new Date(env.API_EXPIRE_TIME as string) <= new Date()
  ) {
    await apiLogin();
  }

  if (
    new Date(env.API_EXPIRE_TIME as string) <= new Date() &&
    env.API_REFRESH_TOKEN
  ) {
    await apiRefreshToken();
  } else {
    await apiLogin();
  }

  try {
    const result = await fetch(`${globalEnv.default.url.api}/auth/users`, {
      method: 'POST',
      body: data,
      next: {
        revalidate: 30,
        tags: [providerId, provider],
      },
      headers: {
        Authorization: `Bearer ${env.API_ACCESS_TOKEN}`,
      },
    });

    const text = await result.text();

    if (result.status === 200) {
      return JSON.parse(text) as User;
    } else if (result.status === 401) {
      await apiLogout();
      throw new Error(
        'Error unauthenticated when fetch user data from backend: ' + text,
      );
    }

    throw new Error('Failed to fetch user data from backend');
  } catch (err) {
    console.error('Failed to login', err);
    return null;
  }
};

const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) return null;

  const data: FormData = new FormData();
  data.append('refreshToken', refreshToken);

  try {
    const result = await fetch(
      `${globalEnv.default.url.api}/auth/refresh-token`,
      {
        method: 'POST',
        body: data,
        cache: 'no-cache',
      },
    );

    if (result.status === 200) {
      return (await result
        .text()
        .then((data) =>
          data ? JSON.parse(data) : {},
        )) as RefreshTokenResponse;
    }

    throw new Error(
      'Failed to fetch user data from backend: ' + (await result.text()),
    );
  } catch (err) {
    console.error('Failed to login', err);
    return null;
  }
};

const apiLogin = async () => {
  const data: FormData = new FormData();

  data.append('provider', env.API_PROVIDER as string);
  data.append('providerId', env.API_PROVIDER_ID as string);

  try {
    const result = await fetch(`${globalEnv.default.url.api}/auth/login`, {
      method: 'POST',
      body: data,
      next: {
        revalidate: 30,
      },
    });

    const text = await result.text();

    if (result.status === 200) {
      const user = JSON.parse(text) as User;
      if (user) {
        env.API_ACCESS_TOKEN = user.accessToken;
        env.API_REFRESH_TOKEN = user.refreshToken;
        env.API_EXPIRE_TIME = user.expireTime;
        return;
      }
    }

    throw new Error('Failed to login as API: ' + text);
  } catch (err) {
    console.error('Failed to login as API', err);
    return null;
  }
};

const apiRefreshToken = async () => {
  const result = await refreshToken(env.API_REFRESH_TOKEN as string);
  if (result) {
    env.API_REFRESH_TOKEN = result.refreshToken;
    env.API_ACCESS_TOKEN = result.accessToken;
    env.API_EXPIRE_TIME = result.expireTime;
  } else {
    await apiLogout();
  }
};

const apiLogout = async () => {
  env.API_REFRESH_TOKEN = '';
  env.API_ACCESS_TOKEN = '';
  env.API_EXPIRE_TIME = '';
};
