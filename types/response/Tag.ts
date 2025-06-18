import { TAG_DEFAULT_COLOR, TAG_SEPARATOR } from '@/constant/constant';
import { TagGroup } from '@/types/response/TagGroup';



import { z } from 'zod/v4';


export const DetailTagDtoSchema = z.object({
	name: z.string(),
	icon: z.string(),
	color: z.string(),
	position: z.number(),
});

export const TagSchema = z.object({
	name: z.string(),
	value: z.string(),
	color: z.string(),
	icon: z.string().optional(),
});

export const TagDtoSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	categoryId: z.number(),
	position: z.number(),
	icon: z.string().optional(),
	modId: z.string().optional(),
	fullname: z.string(),
});

export type DetailTagDto = z.infer<typeof DetailTagDtoSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type TagDto = z.infer<typeof TagDtoSchema>;

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
