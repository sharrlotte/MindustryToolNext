import { useParams } from 'next/navigation';

export default function useSafeParam() {
  const params = useParams();
  return new SafeParams(params);
}

class SafeParams {
  private params: any;

  constructor(params: any) {
    this.params = params;
  }

  get(key: string, defaultValue: string = ''): string {
    return (this.params[key] as string) ?? defaultValue;
  }

  getAll(key: string, defaultValue: string[] = []): string[] {
    return (this.params[key] as string[]) ?? defaultValue;
  }

  raw() {
    return this.params;
  }
}
