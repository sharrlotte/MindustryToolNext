import { UserRole } from '@/constant/enum';

export interface User {
  id: string;
  name: string;
  imageUrl?: string | null;
  roles: UserRole[];
}
