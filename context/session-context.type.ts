import { Locale } from '@/i18n/config';
import { Session } from '@/types/response/Session';

export const paginationTypes = ['grid', 'infinite-scroll'] as const;

export type SessionState = 'loading' | 'authenticated' | 'unauthenticated';
export type PaginationType = (typeof paginationTypes)[number];

export const PAGINATION_TYPE_PERSISTENT_KEY = 'paginationType';
export const PAGINATION_SIZE_PERSISTENT_KEY = 'paginationSize';

export const DEFAULT_PAGINATION_TYPE = 'grid';
export const DEFAULT_PAGINATION_SIZE = 10;

export type Config = {
  paginationType: PaginationType;
  paginationSize: number;
  Locale: Locale;
};

export type ServerSessionContextType = (
  | {
      session: null;
      state: 'loading' | 'unauthenticated';
    }
  | {
      session: Session;
      state: 'authenticated';
    }
) & {
  createdAt: number;
  config: Config;
};

export type SessionContextType = ServerSessionContextType & {
  setConfig: <T extends keyof Config>(config: T, value: Config[T]) => void;
};
