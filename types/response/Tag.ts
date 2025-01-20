import { TAG_DEFAULT_COLOR, TAG_SEPARATOR } from '@/constant/constant';
import TagGroup from '@/types/response/TagGroup';

type Tag = {
  name: string;
  value: string;
  color: string;
  icon?: string;
};

export type TagDto = {
  id: string;
  name: string;
  description: string;
  categoryId: number;
  icon?: string;
  modId?: string;
};

export default Tag;

export class Tags {
  static parseString(str: string) {
    const [name, value] = str.split(TAG_SEPARATOR);
    if (!name || !value) throw new Error(`Invalid tag: ${str}`);

    return { name, value, color: TAG_DEFAULT_COLOR };
  }

  static parseStringArray(arr: string[] | null) {
    if (!arr) {
      return [];
    }
    const result = [];
    for (const tag of arr) {
      try {
        result.push(Tags.parseString(tag));
      } catch (err) {
        // ignore
      }
    }
    return result;
  }

  static fromTagGroup(tags: TagGroup[]): Tag[] {
    return tags.flatMap((group) =>
      group.values.map((v) => {
        return {
          name: group.name,
          value: v.name,
          color: group.color,
        };
      }),
    );
  }

  static toString(tags: Tag[]) {
    return tags.map((tag) => tag.name + TAG_SEPARATOR + tag.value).join();
  }
}
