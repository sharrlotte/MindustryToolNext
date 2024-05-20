import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import serverEnv from '@/constant/serverEnv';
import env from '@/constant/env';
import { RefreshTokenResponse } from '@/types/response/RefreshTokenResponse';
import { JWT } from 'next-auth/jwt';
import { LoginResponse } from '@/types/response/LoginResponse';
import 'server-only';

class Lock {
  private promise: Promise<void>;

  private resolve: (() => void) | undefined;

  constructor() {
    this.promise = Promise.resolve();
    this.resolve = undefined;
  }

  await() {
    return this.promise;
  }

  acquire() {
    this.promise = new Promise<void>((resolve) => (this.resolve = resolve));
  }

  release() {
    if (this.resolve) {
      this.resolve();
    }
  }
}

export default Lock;

const lock = new Lock();

const authData: {
  accessToken: string;
  refreshToken: string;
  expireTime: number;
} = {
  accessToken: '',
  refreshToken: '',
  expireTime: Number('0'),
};

const JWT_VERSION = 2;

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
    //TODO: Fix type
    async session(params: any) {
      if ('token' in params) {
        const { session, token } = params;

        if (session.user && token) {
          session.user.id = token.userId;
          session.user.name = token.name ?? '';
          session.user.imageUrl = session.user.image;
          session.user.roles = token.roles || [];
          session.user.accessToken = token.accessToken;
          session.user.expireAt = token.expireAt;
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
          token.expireAt = apiUser.expireTime;
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
  const data: FormData = new FormData();

  data.append('provider', provider);
  data.append('providerId', providerId);
  data.append('name', name);
  data.append('image', image);

  if (!authData.accessToken) {
    await apiLogin();
  }

  if (authData.expireTime <= Date.now()) {
    if (authData.accessToken) {
      await apiRefreshToken();
    } else {
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
      return JSON.parse(text ?? '{}') as LoginResponse;
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
  await lock.await();
  lock.acquire();

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
      const user = JSON.parse(text) as LoginResponse;
      if (user) {
        authData.accessToken = user.accessToken;
        authData.refreshToken = user.refreshToken;
        authData.expireTime = user.expireTime;
        return;
      }
    }
    throw new Error(text);
  } catch (error) {
    return null;
  } finally {
    lock.release();
  }
};

async function apiRefreshToken() {
  const result = await refreshToken(authData.refreshToken);
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
}

export { authData };
