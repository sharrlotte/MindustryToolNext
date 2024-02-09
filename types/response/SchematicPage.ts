import { Like } from './Like';

export type SchematicPage = Array<{
  id: string;
  name: string;
  like: number;
  userLike: Like;
}>;
