import { Like } from './Like';

export type Schematic ={
  id: string;
  name: string;
  like: number;
  userLike: Like;
};
