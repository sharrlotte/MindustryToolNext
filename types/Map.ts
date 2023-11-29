import { ItemRequirement } from "./ItemRequirement";
import { Like } from "./Like";

export default interface Schematic {
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
