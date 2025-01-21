import { TAG_DEFAULT_COLOR, TAG_SEPARATOR } from '@/constant/constant';
import TagGroup from '@/types/response/TagGroup';

type Tag = {
  name: string;
  value: string;
  color: string;
  icon?: string;
};

export type TagDto = {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  position: number;
  icon?: string;
  modId?: string;
};

export default Tag;

export class Tags {
  static parseString(str: string, source: TagGroup[]) {
    const [name, value] = str.split(TAG_SEPARATOR);
    if (!name || !value) throw new Error(`Invalid tag: ${str}`);

    const tag = source.find((t) => t.name === name);
    const icon = tag?.values.find((t) => t.name === value)?.icon

    return { name, value, color: tag?.color ?? TAG_DEFAULT_COLOR, icon: icon };
  }

  static parseStringArray(arr: string[] | null, source: TagGroup[]) {
    if (!arr) {
      return [];
    }
    const result = [];
    for (const tag of arr) {
      try {
        result.push(Tags.parseString(tag, source));
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
          icon: v.icon,
        };
      }),
    );
  }

  static fromTagGroupWithSource(tags: TagGroup[], source: TagGroup[]): Tag[] {
    return tags.flatMap((group) =>
      group.values.map((v) => {
        return {
          name: group.name,
          value: v.name,
          color: group.color,
          icon: source.find((g) => g.name === group.name)?.values.find((t) => t.name === v.name)?.icon,
        };
      }),
    );
  }

  static toString(tags: Tag[]) {
    return tags.map((tag) => tag.name + TAG_SEPARATOR + tag.value).join();
  }
}
