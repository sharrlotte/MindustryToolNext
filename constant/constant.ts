import { AllTagGroup } from '@/types/response/TagGroup';

import { Locale } from '@/i18n/config';

import { z } from 'zod/v4';

export const isServer = typeof window === 'undefined';
export const isClient = !isServer;

export const dateFormat = 'dd-MM-yyyy hh:mm:ss';

export const IMAGE_PREFIX = 'data:image/png;base64,';
export const GITHUB_PATTERN = /https:\/\/api\.github\.com\/repos\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/.+/;

export const TAG_DEFAULT_COLOR = 'green';

export const TAG_SEPARATOR = '_';

export const itemTypes = ['schematic', 'map', 'post', 'server', 'plugin'];

export const errorStatus = ['PENDING', 'RESOLVED', 'FEATURE', 'INSPECTING'] as const;

export type ErrorStatus = (typeof errorStatus)[number];

export type ItemType = (typeof itemTypes)[number];

export type TagType = keyof AllTagGroup;

export const acceptedImageFormats = '.png, .jpg, .jpeg, .webp, .gif';

export const SHOW_TAG_NAME_PERSISTENT_KEY = 'showTagName';
export const SHOW_TAG_NUMBER_PERSISTENT_KEY = 'showTagNumber';

export const PRESET_LOCAL_STORAGE_NAME = 'TAG_PRESET';
export const presetTypes = ['schematic', 'map', 'plugin', 'post'] as const;

export type PresetType = (typeof presetTypes)[number];

export const paginationTypes = ['grid', 'infinite-scroll'] as const;

export type SessionState = 'loading' | 'authenticated' | 'unauthenticated';
export type PaginationType = (typeof paginationTypes)[number];

export const PAGINATION_TYPE_PERSISTENT_KEY = 'paginationType';
export const PAGINATION_SIZE_PERSISTENT_KEY = 'paginationSize';
export const SESSION_ID_PERSISTENT_KEY = 'SESSION_ID';

export const LOGIC_PERSISTENT_KEY = 'LOGIC_DATA';

export const DEFAULT_PAGINATION_TYPE = 'grid';
export const DEFAULT_PAGINATION_SIZE = 10;

export type Config = {
	paginationType: PaginationType;
	paginationSize: number;
	Locale: Locale;
};

export type LogType = 'SYSTEM' | 'DATABASE' | 'API' | 'DISCORD_MESSAGE' | 'REQUEST' | 'USER_LOGIN';

export type MetricType =
	| 'DAILY_LIKE'
	| 'DAILY_USER'
	| 'LOGGED_DAILY_USER'
	| 'DAILY_MOD_USER'
	| 'DAILY_WEB_USER'
	| 'DAILY_SERVER_USER';

export const userRoles = ['ADMIN', 'USER', 'SHAR', 'CONTRIBUTOR'] as const;

export const maxMessageLength = 1000;
export type UserRole = (typeof userRoles)[number];

export const serverStatus = ['DOWN', 'UP', 'HOST', 'DELETED', 'NOT_RESPONSE', 'ERROR'] as const;
export type ServerStatus = (typeof serverStatus)[number];

export const ServerStatusSchema = z.enum(serverStatus);

export const uploadStates = ['QUEUING', 'PROCESSING', 'ERROR', 'RETRY'] as const;
export type UploadState = (typeof uploadStates)[number];

export type AuthorityEnum =
	| 'CREATE_NOTIFICATION' //
	| 'VIEW_DASH_BOARD' //
	| 'VIEW_USER_ROLE'
	| 'EDIT_USER_ROLE' //
	| 'VIEW_USER_AUTHORITY'
	| 'EDIT_USER_AUTHORITY' //
	| 'VIEW_ROLE_AUTHORITY'
	| 'EDIT_ROLE_AUTHORITY' //
	| 'MANAGE_ROLE' //
	| 'VIEW_LOG'
	| 'DELETE_LOG' //
	| 'VIEW_ADMIN_SERVER'
	| 'EDIT_ADMIN_SERVER'
	| 'DELETE_ADMIN_SERVER'
	| 'SHUTDOWN_SERVER'
	| 'RELOAD_SERVER'
	| 'START_SERVER'
	| 'UPDATE_SERVER' //
	| 'VERIFY_SCHEMATIC'
	| 'DELETE_SCHEMATIC' //
	| 'VERIFY_MAP'
	| 'DELETE_MAP' //
	| 'VERIFY_POST'
	| 'DELETE_POST' //
	| 'VERIFY_PLUGIN'
	| 'DELETE_PLUGIN' //
	| 'VIEW_SETTING'
	| 'EDIT_SETTING' //
	| 'VIEW_TRANSLATION'
	| 'CREATE_TRANSLATION'
	| 'EDIT_TRANSLATION'
	| 'DELETE_TRANSLATION' //
	| 'VIEW_FILE'
	| 'CREATE_FILE'
	| 'EDIT_FILE'
	| 'DELETE_FILE' //
	| 'VIEW_DOCUMENT'
	| 'CREATE_DOCUMENT'
	| 'EDIT_DOCUMENT'
	| 'DELETE_DOCUMENT' //
	| 'EDIT_USER' //
	| 'MANAGE_TAG' //
	| 'MANAGE_COMMENT'
	| 'MANAGE_SERVER_MANAGER';

export type LikeAction = 'LIKE' | 'DISLIKE';

export const colours: Record<string, string> = {
	royal: '#4169e1',
	slate: '#708090',
	sky: '#87ceeb',
	cyan: '#00ffff',
	teal: '#008080',
	green: '#00ff00',
	acid: '#7fff00',
	lime: '#32cd32',
	forest: '#228b22',
	olive: '#6b8e23',
	yellow: '#ffff00',
	gold: '#ffd700',
	goldenrod: '#daa520',
	orange: '#ffa500',
	brown: '#8b4513',
	tan: '#d2b48c',
	brick: '#b22222',
	red: '#ff0000',
	scarlet: '#ff341c',
	crimson: '#dc143c',
	coral: '#ff7f50',
	salmon: '#fa8072',
	pink: '#ff69b4',
	magenta: '#ff00ff',
	purple: '#a020f0',
	violet: '#ee82ee',
	maroon: '#b03060',
	white: '#ffffff',
	lightGray: '#bfbfbfff',
	gray: '#7f7f7fff',
	darkGray: '#3f3f3fff',
	black: '#000000',
	clear: '#00000000',
	'': 'var(--foreground)',
	accent: 'yellow',
	W: 'yellow',
	E: 'red',
};

export type Brand<K, T> = K & { __brand: T };

export type Megabyte = Brand<number, 'MB'>;
export type Byte = Brand<number, 'Byte'>;
