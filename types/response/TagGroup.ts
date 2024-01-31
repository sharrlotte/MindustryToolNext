import { Tags } from '@/types/response/Tag';

type TagGroup = {
  name: string;
  value: string[];
  color: string;
  duplicate: boolean;
};

export default TagGroup;

export type AllTagGroup = {
  schematic: TagGroup[];
  map: TagGroup[];
  post: TagGroup[];
};

export class TagGroups {
  static toString(tags: TagGroup[]) {
    return Tags.toString(Tags.fromTagGroup(tags));
  }
}
