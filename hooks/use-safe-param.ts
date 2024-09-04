import { Params } from 'next/dist/client/components/params';
import { useParams } from 'next/navigation';

export default function useSafeParam() {
  const params = useParams();
  return new SafeParams(params);
}

class SafeParams {
  private params: Params;

  constructor(params: Params) {
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
