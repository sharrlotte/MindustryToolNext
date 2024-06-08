import { UserRole } from '@/constant/enum';

export interface Session {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  roles: UserRole[];
  provider: string;
  providerId: string;
  lastLogin: number;
  createdAt: number;
}
