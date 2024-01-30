import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import serverEnv from '@/constant/serverEnv';
import env from '@/constant/env';
import { env as environment } from 'process';
import { RefreshTokenResponse } from '@/types/response/RefreshTokenResponse';
import { User } from '@/types/response/User';
import { JWT } from 'next-auth/jwt';

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
  },
  providers: [
    Discord({
      clientId: serverEnv.oauth.discord.client_id,
      clientSecret: serverEnv.oauth.discord.client_secret,
    }),
  ],
  callbacks: {
    async session(params) {
      if ('token' in params) {
        const { session, token } = params;

        if (session.user && token) {
          session.user.id = token.userId;
          session.user.name = token.name ?? '';
          session.user.imageUrl = session.user.image;
          session.user.roles = token.roles || [];
          session.user.accessToken = token.accessToken;
        }
        return session;
      }

      return params.session;
    },
    async jwt(params) {
      const { token, account, user } = params;

      if (account && user) {
        const { provider, providerAccountId: providerId } = account;

        const { name, image } = user;

        const apiUser = await getUser({
          providerId,
          provider,
          name: name ?? '',
          image: image ?? '',
        });

        if (apiUser) {
          token.userId = apiUser.id;
          token.name = apiUser.name;
          token.roles = apiUser.roles;
          token.accessToken = apiUser.accessToken;
          token.version = JWT_VERSION;

          return token;
        } else {
          return null;
        }
      }

      if (token.version !== JWT_VERSION) {
        return null;
      }

      return token;
    },
  },
  events: {
    async signOut(params) {
      //@ts-ignore
      const token = params?.token as JWT;
      //@ts-check
      if (token) {
        await logout(token.accessToken);
      }
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
  console.log(`Get user: ${provider} - ${providerId}`);
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

const logout = async (accessToken: string) => {
  if (!accessToken) return null;

  try {
    const result = await fetch(`${env.url.api}/auth/logout`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const text = await result.text();

    if (result.status === 200) {
      return;
    }

    throw new Error(text);
  } catch (err) {
    console.error('Failed to logout', err);
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

    const text = await result.text();

    if (result.status === 200) {
      return JSON.parse(text ?? '{}') as RefreshTokenResponse;
    }

    throw new Error('Failed to fetch user data from backend: ' + text);
  } catch (err) {
    console.error('Failed to login', err);
    return null;
  }
};

const apiLogin = async () => {
  const data: FormData = new FormData();

  data.append('provider', serverEnv.tokens.api_provider as string);
  data.append('providerId', serverEnv.tokens.api_provider_id as string);

  try {
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
    throw new Error(text);
  } catch (error) {
    console.log('Failed to login as API: ' + error);
    return null;
  }
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
