import { Like } from './Like';

export interface Map {
  id: string;
  name: string;
  authorId: string;
  description: string;
  tags: string[];
  like: number;
  height: number;
  width: number;
  isVerified: boolean;
  verifyAdmin: string;
  userLike: Like;
}
