import { TAG_DEFAULT_COLOR, TAG_SEPARATOR } from '@/constant/constant';
import TagGroup from '@/types/response/TagGroup';

export type DetailTagDto = {
  name: string;
  icon: string;
  color: string;
};

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
  static parseString(str: DetailTagDto) {
    const [name, value] = str.name.split(TAG_SEPARATOR);
    if (!name || !value) throw new Error(`Invalid tag: ${str}`);

    return { name, value, color: str.color ?? TAG_DEFAULT_COLOR, icon: str.icon };
  }

  static parseStringArray(arr: DetailTagDto[] | null) {
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
