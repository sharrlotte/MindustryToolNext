import { AllTagGroup } from "@/types/response/TagGroup";

export const dateFormat = 'dd-MM-yyyy hh:mm:ss';

export const IMAGE_PREFIX = 'data:image/png;base64,';

export const TAG_DEFAULT_COLOR = 'green';

export const TAG_SEPARATOR = '_';

export const itemTypes = ['schematic', 'map', 'post'];

export type ItemType = (typeof itemTypes)[number];

export type TagType = keyof AllTagGroup
