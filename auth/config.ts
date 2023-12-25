import * as globalEnv from '@/constant/env';
import serverEnv from '@/constant/serverEnv';
import RefreshTokenResponse from '@/types/response/RefreshTokenResponse';
import User from '@/types/response/User';
import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import { env } from 'process';

const authData: {
  accessToken?: string;
  refreshToken?: string;
  expireTime: number;
} = {
  accessToken: env.API_ACCESS_TOKEN,
  refreshToken: env.API_REFRESH_TOKEN,
  expireTime: Number(env.API_EXPIRE_TIME ?? '0'),
};

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
        } else {
          session.user = undefined;
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

  if (!authData.accessToken) {
    console.log('No API token');
    await apiLogin();
  }

  if (authData.expireTime <= Date.now()) {
    if (authData.accessToken) {
      console.log('API token expired');
      await apiRefreshToken();
    } else {
      console.log('No API refresh token');
      await apiLogin();
    }
  }

  try {
    const result = await fetch(`${globalEnv.default.url.api}/auth/users`, {
      method: 'POST',
      body: data,
      next: {
        revalidate: 300,
        tags: [`${providerId}${provider}`],
      },
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
      },
    });

    const text = await result.text();

    if (result.status === 200) {
      return JSON.parse(text ?? '{}') as User;
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

  console.log('Refresh token');

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
        revalidate: 300,
      },
    });

    const text = await result.text();

    if (result.status === 200) {
      const user = JSON.parse(text) as User;
      if (user) {
        authData.accessToken = user.accessToken;
        authData.refreshToken = user.refreshToken;
        authData.expireTime = user.expireTime;
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
    authData.accessToken = result.accessToken;
    authData.refreshToken = result.refreshToken;
    authData.expireTime = Date.now();
  } else {
    await apiLogout();
  }
};

const apiLogout = async () => {
  authData.accessToken = undefined;
  authData.refreshToken = undefined;
  authData.expireTime = Date.now();
};

export { authData };
