import { Like } from './Like';

export type MapPage = Array<{
  id: string;
  name: string;
  like: number;
  userLike: Like;
}>;
