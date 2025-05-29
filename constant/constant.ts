import { Locale } from '@/i18n/config';
import { AllTagGroup } from '@/types/response/TagGroup';

export const dateFormat = 'dd-MM-yyyy hh:mm:ss';

export const IMAGE_PREFIX = 'data:image/png;base64,';
export const GITHUB_PATTERN = /https:\/\/api\.github\.com\/repos\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/.+/;

export const TAG_DEFAULT_COLOR = 'green';

export const TAG_SEPARATOR = '_';

export const itemTypes = ['schematic', 'map', 'post', 'server', 'plugin'];

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
	| 'MANAGE_COMMENT';

export type LikeAction = 'LIKE' | 'DISLIKE';

export const colours: Record<string, string> = {
	aliceblue: '#f0f8ff',
	antiquewhite: '#faebd7',
	aqua: '#00ffff',
	aquamarine: '#7fffd4',
	azure: '#f0ffff',
	beige: '#f5f5dc',
	bisque: '#ffe4c4',
	black: '#000000',
	blanchedalmond: '#ffebcd',
	blue: '#0000ff',
	blueviolet: '#8a2be2',
	brown: '#a52a2a',
	burlywood: '#deb887',
	cadetblue: '#5f9ea0',
	chartreuse: '#7fff00',
	chocolate: '#d2691e',
	coral: '#ff7f50',
	cornflowerblue: '#6495ed',
	cornsilk: '#fff8dc',
	crimson: '#dc143c',
	cyan: '#00ffff',
	darkblue: '#00008b',
	darkcyan: '#008b8b',
	darkgoldenrod: '#b8860b',
	darkgray: '#a9a9a9',
	darkgreen: '#006400',
	darkkhaki: '#bdb76b',
	darkmagenta: '#8b008b',
	darkolivegreen: '#556b2f',
	darkorange: '#ff8c00',
	darkorchid: '#9932cc',
	darkred: '#8b0000',
	darksalmon: '#e9967a',
	darkseagreen: '#8fbc8f',
	darkslateblue: '#483d8b',
	darkslategray: '#2f4f4f',
	darkturquoise: '#00ced1',
	darkviolet: '#9400d3',
	deeppink: '#ff1493',
	deepskyblue: '#00bfff',
	dimgray: '#696969',
	dodgerblue: '#1e90ff',
	firebrick: '#b22222',
	floralwhite: '#fffaf0',
	forestgreen: '#228b22',
	fuchsia: '#ff00ff',
	gainsboro: '#dcdcdc',
	ghostwhite: '#f8f8ff',
	gold: '#ffd700',
	goldenrod: '#daa520',
	gray: '#808080',
	green: '#38E08C',
	greenyellow: '#adff2f',
	honeydew: '#f0fff0',
	hotpink: '#ff69b4',
	'indianred ': '#cd5c5c',
	indigo: '#4b0082',
	ivory: '#fffff0',
	khaki: '#f0e68c',
	lavender: '#e6e6fa',
	lavenderblush: '#fff0f5',
	lawngreen: '#7cfc00',
	lemonchiffon: '#fffacd',
	lightblue: '#add8e6',
	lightcoral: '#f08080',
	lightcyan: '#e0ffff',
	lightgoldenrodyellow: '#fafad2',
	lightgrey: '#d3d3d3',
	lightgreen: '#90ee90',
	lightpink: '#ffb6c1',
	lightsalmon: '#ffa07a',
	lightseagreen: '#20b2aa',
	lightskyblue: '#87cefa',
	lightslategray: '#778899',
	lightsteelblue: '#b0c4de',
	lightyellow: '#ffffe0',
	lime: '#00ff00',
	limegreen: '#32cd32',
	linen: '#faf0e6',
	magenta: '#ff00ff',
	maroon: '#800000',
	mediumaquamarine: '#66cdaa',
	mediumblue: '#0000cd',
	mediumorchid: '#ba55d3',
	mediumpurple: '#9370d8',
	mediumseagreen: '#3cb371',
	mediumslateblue: '#7b68ee',
	mediumspringgreen: '#00fa9a',
	mediumturquoise: '#48d1cc',
	mediumvioletred: '#c71585',
	midnightblue: '#191970',
	mintcream: '#f5fffa',
	mistyrose: '#ffe4e1',
	moccasin: '#ffe4b5',
	navajowhite: '#ffdead',
	navy: '#000080',
	oldlace: '#fdf5e6',
	olive: '#808000',
	olivedrab: '#6b8e23',
	orange: '#ffa500',
	orangered: '#ff4500',
	orchid: '#da70d6',
	palegoldenrod: '#eee8aa',
	palegreen: '#98fb98',
	paleturquoise: '#afeeee',
	palevioletred: '#d87093',
	papayawhip: '#ffefd5',
	peachpuff: '#ffdab9',
	peru: '#cd853f',
	pink: '#ffc0cb',
	plum: '#dda0dd',
	powderblue: '#b0e0e6',
	purple: '#800080',
	rebeccapurple: '#663399',
	red: '#ff0000',
	rosybrown: '#bc8f8f',
	royalblue: '#4169e1',
	saddlebrown: '#8b4513',
	salmon: '#fa8072',
	sandybrown: '#f4a460',
	seagreen: '#2e8b57',
	seashell: '#fff5ee',
	sienna: '#a0522d',
	silver: '#c0c0c0',
	skyblue: '#87ceeb',
	slateblue: '#6a5acd',
	slategray: '#708090',
	snow: '#fffafa',
	springgreen: '#00ff7f',
	steelblue: '#4682b4',
	tan: '#d2b48c',
	teal: '#008080',
	thistle: '#d8bfd8',
	tomato: '#ff6347',
	turquoise: '#40e0d0',
	violet: '#ee82ee',
	wheat: '#f5deb3',
	white: 'var(--foreground)',
	whitesmoke: '#f5f5f5',
	yellow: '#ffe900',
	yellowgreen: '#9acd32',
	accent: 'yellow',
	'': 'var(--foreground)',
	scarlet: '#FBD400',
};

const localeToFlag: Record<string, string> = {
	EN: '🇬🇧',
	AD: '🇦🇩',
	AE: '🇦🇪',
	AF: '🇦🇫',
	AG: '🇦🇬',
	AI: '🇦🇮',
	AL: '🇦🇱',
	AM: '🇦🇲',
	AO: '🇦🇴',
	AQ: '🇦🇶',
	AR: '🇦🇷',
	AS: '🇦🇸',
	AT: '🇦🇹',
	AU: '🇦🇺',
	AW: '🇦🇼',
	AX: '🇦🇽',
	AZ: '🇦🇿',
	BA: '🇧🇦',
	BB: '🇧🇧',
	BD: '🇧🇩',
	BE: '🇧🇪',
	BF: '🇧🇫',
	BG: '🇧🇬',
	BH: '🇧🇭',
	BI: '🇧🇮',
	BJ: '🇧🇯',
	BL: '🇧🇱',
	BM: '🇧🇲',
	BN: '🇧🇳',
	BO: '🇧🇴',
	BQ: '🇧🇶',
	BR: '🇧🇷',
	BS: '🇧🇸',
	BT: '🇧🇹',
	BV: '🇧🇻',
	BW: '🇧🇼',
	BY: '🇧🇾',
	BZ: '🇧🇿',
	CA: '🇨🇦',
	CC: '🇨🇨',
	CD: '🇨🇩',
	CF: '🇨🇫',
	CG: '🇨🇬',
	CH: '🇨🇭',
	CI: '🇨🇮',
	CK: '🇨🇰',
	CL: '🇨🇱',
	CM: '🇨🇲',
	CN: '🇨🇳',
	CO: '🇨🇴',
	CR: '🇨🇷',
	CU: '🇨🇺',
	CV: '🇨🇻',
	CW: '🇨🇼',
	CX: '🇨🇽',
	CY: '🇨🇾',
	CZ: '🇨🇿',
	DE: '🇩🇪',
	DJ: '🇩🇯',
	DK: '🇩🇰',
	DM: '🇩🇲',
	DO: '🇩🇴',
	DZ: '🇩🇿',
	EC: '🇪🇨',
	EE: '🇪🇪',
	EG: '🇪🇬',
	EH: '🇪🇭',
	ER: '🇪🇷',
	ES: '🇪🇸',
	ET: '🇪🇹',
	FI: '🇫🇮',
	FJ: '🇫🇯',
	FK: '🇫🇰',
	FM: '🇫🇲',
	FO: '🇫🇴',
	FR: '🇫🇷',
	GA: '🇬🇦',
	GB: '🇬🇧',
	GD: '🇬🇩',
	GE: '🇬🇪',
	GF: '🇬🇫',
	GG: '🇬🇬',
	GH: '🇬🇭',
	GI: '🇬🇮',
	GL: '🇬🇱',
	GM: '🇬🇲',
	GN: '🇬🇳',
	GP: '🇬🇵',
	GQ: '🇬🇶',
	GR: '🇬🇷',
	GS: '🇬🇸',
	GT: '🇬🇹',
	GU: '🇬🇺',
	GW: '🇬🇼',
	GY: '🇬🇾',
	HK: '🇭🇰',
	HM: '🇭🇲',
	HN: '🇭🇳',
	HR: '🇭🇷',
	HT: '🇭🇹',
	HU: '🇭🇺',
	ID: '🇮🇩',
	IE: '🇮🇪',
	IL: '🇮🇱',
	IM: '🇮🇲',
	IN: '🇮🇳',
	IO: '🇮🇴',
	IQ: '🇮🇶',
	IR: '🇮🇷',
	IS: '🇮🇸',
	IT: '🇮🇹',
	JE: '🇯🇪',
	JM: '🇯🇲',
	JO: '🇯🇴',
	JA: '🇯🇵',
	JP: '🇯🇵',
	KE: '🇰🇪',
	KG: '🇰🇬',
	KH: '🇰🇭',
	KI: '🇰🇮',
	KM: '🇰🇲',
	KN: '🇰🇳',
	KP: '🇰🇵',
	KR: '🇰🇷',
	KO: '🇰🇷',
	KW: '🇰🇼',
	KY: '🇰🇾',
	KZ: '🇰🇿',
	LA: '🇱🇦',
	LB: '🇱🇧',
	LC: '🇱🇨',
	LI: '🇱🇮',
	LK: '🇱🇰',
	LR: '🇱🇷',
	LS: '🇱🇸',
	LT: '🇱🇹',
	LU: '🇱🇺',
	LV: '🇱🇻',
	LY: '🇱🇾',
	MA: '🇲🇦',
	MC: '🇲🇨',
	MD: '🇲🇩',
	ME: '🇲🇪',
	MF: '🇲🇫',
	MG: '🇲🇬',
	MH: '🇲🇭',
	MK: '🇲🇰',
	ML: '🇲🇱',
	MM: '🇲🇲',
	MN: '🇲🇳',
	MO: '🇲🇴',
	MP: '🇲🇵',
	MQ: '🇲🇶',
	MR: '🇲🇷',
	MS: '🇲🇸',
	MT: '🇲🇹',
	MU: '🇲🇺',
	MV: '🇲🇻',
	MW: '🇲🇼',
	MX: '🇲🇽',
	MY: '🇲🇾',
	MZ: '🇲🇿',
	NA: '🇳🇦',
	NC: '🇳🇨',
	NE: '🇳🇪',
	NF: '🇳🇫',
	NG: '🇳🇬',
	NI: '🇳🇮',
	NL: '🇳🇱',
	NO: '🇳🇴',
	NP: '🇳🇵',
	NR: '🇳🇷',
	NU: '🇳🇺',
	NZ: '🇳🇿',
	OM: '🇴🇲',
	PA: '🇵🇦',
	PE: '🇵🇪',
	PF: '🇵🇫',
	PG: '🇵🇬',
	PH: '🇵🇭',
	PK: '🇵🇰',
	PL: '🇵🇱',
	PM: '🇵🇲',
	PN: '🇵🇳',
	PR: '🇵🇷',
	PS: '🇵🇸',
	PT: '🇵🇹',
	PW: '🇵🇼',
	PY: '🇵🇾',
	QA: '🇶🇦',
	RE: '🇷🇪',
	RO: '🇷🇴',
	RS: '🇷🇸',
	RU: '🇷🇺',
	RW: '🇷🇼',
	SA: '🇸🇦',
	SB: '🇸🇧',
	SC: '🇸🇨',
	SD: '🇸🇩',
	SE: '🇸🇪',
	SG: '🇸🇬',
	SH: '🇸🇭',
	SI: '🇸🇮',
	SJ: '🇸🇯',
	SK: '🇸🇰',
	SL: '🇸🇱',
	SM: '🇸🇲',
	SN: '🇸🇳',
	SO: '🇸🇴',
	SR: '🇸🇷',
	SS: '🇸🇸',
	ST: '🇸🇹',
	SV: '🇸🇻',
	SX: '🇸🇽',
	SY: '🇸🇾',
	SZ: '🇸🇿',
	TC: '🇹🇨',
	TD: '🇹🇩',
	TF: '🇹🇫',
	TG: '🇹🇬',
	TH: '🇹🇭',
	TJ: '🇹🇯',
	TK: '🇹🇰',
	TL: '🇹🇱',
	TM: '🇹🇲',
	TN: '🇹🇳',
	TO: '🇹🇴',
	TR: '🇹🇷',
	TT: '🇹🇹',
	TV: '🇹🇻',
	TW: '🇹🇼',
	TZ: '🇹🇿',
	UA: '🇺🇦',
	UG: '🇺🇬',
	UM: '🇺🇲',
	US: '🇺🇸',
	UY: '🇺🇾',
	UZ: '🇺🇿',
	VA: '🇻🇦',
	VC: '🇻🇨',
	VE: '🇻🇪',
	VG: '🇻🇬',
	VI: '🇻🇳',
	VN: '🇻🇳',
	VU: '🇻🇺',
	WF: '🇼🇫',
	WS: '🇼🇸',
	XK: '🇽🇰',
	YE: '🇾🇪',
	YT: '🇾🇹',
	ZA: '🇿🇦',
	ZM: '🇿🇲',
	ZW: '🇿🇼',
};

export default localeToFlag;

export const metricUnits = ['MINUTE', 'HOUR', 'DAY'] as const;

export type MetricUnit = (typeof metricUnits)[number];

export const metricFilters: { unit: MetricUnit; interval: number }[] = [
	{
		unit: 'MINUTE',
		interval: 15,
	},
	{
		unit: 'MINUTE',
		interval: 30,
	},
	{
		unit: 'MINUTE',
		interval: 60,
	},
	{
		unit: 'HOUR',
		interval: 12,
	},
	{
		unit: 'HOUR',
		interval: 24,
	},
	{
		unit: 'DAY',
		interval: 7,
	},
	{
		unit: 'DAY',
		interval: 30,
	},
] as const;
