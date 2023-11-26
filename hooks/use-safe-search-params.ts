import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

export default function useSafeSearchParams() {
  const params = useSearchParams();
  return new SafeUrlSearchParams(params);
}

class SafeUrlSearchParams {
  private params: ReadonlyURLSearchParams;

  constructor(params: ReadonlyURLSearchParams) {
    this.params = params;
  }

  get(key: string, defaultValue: string = "") {
    return this.params.get(key) ?? defaultValue;
  }

  getAll(key: string, defaultValue: string[] = []) {
    return this.params.getAll(key) ?? defaultValue;
  }
}
