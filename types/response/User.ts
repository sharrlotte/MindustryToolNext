export type UserRole = 'ADMIN' | 'USER';

export default interface User {
  id: string;
  name: string;
  imageUrl: string;
  role: UserRole[];
  accessToken: string;
  refreshToken: string;
  expireTime: string;
}
