export interface Log {
  id: string;
  content: string;
  environment: string;
  createdAt: number;
  requestUrl: string;
  ip: string;
  userId: string;
}
