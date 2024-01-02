import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import serverEnv from '@/constant/serverEnv';
import env from '@/constant/env';
import { env as environment } from 'process';
import { RefreshTokenResponse } from '@/types/response/RefreshTokenResponse';
import { User } from '@/types/response/User';
import { decodeJWT, encodeJWT } from '@/lib/jwt';
import { JWT } from '@auth/core/jwt';

const authData: {
  accessToken: string;
  refreshToken: string;
  expireTime: number;
} = {
  accessToken: environment.API_ACCESS_TOKEN || '',
  refreshToken: environment.API_REFRESH_TOKEN || '',
  expireTime: Number(environment.API_EXPIRE_TIME ?? '0'),
};

const JWT_VERSION = 1;

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 5,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,

    encode: encodeJWT,
    decode: decodeJWT,
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

      if (session.user) {
        session.user.roles = token.roles || [];
        session.user.id = token.userId;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.expireTime = token.expireTime;
      }

      return session;
    },
    //@ts-ignore
    async jwt(params) {
      //@ts-check
      const { token, account } = params;

      if (account) {
        const { provider, providerAccountId: providerId } = account;

        const user = await getUser({
          providerId,
          provider,
        });

        if (user) {
          token.userId = user.id;
          token.name = user.name;
          token.roles = user.roles;
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.expireTime = user.expireTime;
          token.version = JWT_VERSION;
        } else {
          return undefined;
        }
      }

      if (token.version !== JWT_VERSION) {
        return undefined;
      }

      return token as JWT;
    },
  },
});

type GetMeParams = {
  provider: string;
  providerId: string;
};

const getUser = async ({ providerId, provider }: GetMeParams) => {
  console.log(`Get user: ${provider} - ${providerId}`);
  const data: FormData = new FormData();

  data.append('provider', provider);
  data.append('providerId', providerId);

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
    const result = await fetch(`${env.url.api}/auth/users`, {
      method: 'POST',
      body: data,
      next: {
        revalidate: 60,
        tags: [providerId, provider],
      },
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
      },
    });

    const text = await result.text();

    if (result.status === 200) {
      return JSON.parse(text ?? '{}') as User;
    } else if (result.status === 401) {
      await apiRefreshToken();
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
    const result = await fetch(`${env.url.api}/auth/refresh-token`, {
      method: 'POST',
      body: data,
      cache: 'no-cache',
    });

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

  data.append('provider', serverEnv.tokens.api_provider as string);
  data.append('providerId', serverEnv.tokens.api_provider_id as string);

  const result = await fetch(`${env.url.api}/auth/login`, {
    method: 'POST',
    body: data,
    next: {
      revalidate: 60,
    },
  });

  const text = await result.text();

  if (result.status === 200) {
    const user = JSON.parse(text) as User;
    if (user) {
      authData.accessToken = user.accessToken;
      authData.refreshToken = user.refreshToken;
      authData.expireTime = user.expireTime;
      console.log('API login success');
      return;
    }
  }

  throw new Error('Failed to login as API: ' + text);
};

async function apiRefreshToken() {
  console.log('API refresh token');

  const result = await refreshToken(authData.refreshToken as string);
  if (result) {
    authData.accessToken = result.accessToken;
    authData.refreshToken = result.refreshToken;
    authData.expireTime = result.expireTime;
  } else {
    await apiLogout();
  }
}

async function apiLogout() {
  authData.accessToken = '';
  authData.refreshToken = '';
  authData.expireTime = Date.now();

  console.log('Logged out');
}

apiLogin();

export { authData };
