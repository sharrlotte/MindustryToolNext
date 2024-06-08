'use client';

import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';

export default function useSafeSearchParams() {
  const params = useSearchParams();

  return new SafeUrlSearchParams(params);
}

export class SafeUrlSearchParams {
  private params: ReadonlyURLSearchParams;

  constructor(params: ReadonlyURLSearchParams) {
    this.params = params;
  }

  get<T = string>(key: string, defaultValue: string = '') {
    return (this.params.get(key) ?? defaultValue) as T;
  }

  getAll<T = string>(key: string, defaultValue: string[] = []) {
    return (this.params.getAll(key) ?? defaultValue) as T[];
  }

  raw() {
    return this.params;
  }
}
