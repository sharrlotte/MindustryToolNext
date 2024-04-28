import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useParams } from "next/navigation";

export default function useSafeParam() {
  const params = useParams();
  return new SafeParams(params);
}

class SafeParams {
  private params: Params;

  constructor(params: Params) {
    this.params = params;
  }

  get(key: string, defaultValue: string = ""): string {
    return this.params[key] ?? defaultValue;
  }

  getAll(key: string, defaultValue: string[] = []): string[] {
    return this.params[key] ?? defaultValue;
  }

  raw(){
    return this.params;
  }
}
