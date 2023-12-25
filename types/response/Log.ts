export interface Log {
  id: string;
  content: string;
  environment: string;
  time: number;
  requestUrl: string;
  ip: string;
  userId: string;
}
