import { AllTagGroup } from '@/types/response/TagGroup';

export const dateFormat = 'dd-MM-yyyy hh:mm:ss';

export const IMAGE_PREFIX = 'data:image/png;base64,';

export const TAG_DEFAULT_COLOR = 'green';

export const TAG_SEPARATOR = '_';

export const itemTypes = ['schematic', 'map', 'post', 'server', 'plugin'];

export type ItemType = (typeof itemTypes)[number];

export type TagType = keyof AllTagGroup;

export const acceptedImageFormats = '.png, .jpg, .jpeg, .webp';

export const SHOW_TAG_NAME_PERSISTENT_KEY = 'showTagName';
export const SHOW_TAG_NUMBER_PERSISTENT_KEY = 'showTagNumber';
