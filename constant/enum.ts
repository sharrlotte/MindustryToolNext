export type LogCollection =
  | 'SYSTEM'
  | 'DATABASE'
  | 'API'
  | 'DISCORD_MESSAGE'
  | 'REQUEST'
  | 'USER_LOGIN';

export type MetricCollection =
  | 'DAILY_LIKE'
  | 'DAILY_USER'
  | 'LOGGED_DAILY_USER'
  | 'METRIC_DAILY_MOD_USER'
  | 'METRIC_DAILY_WEB_USER';

export type LikeTarget = 'SCHEMATICS' | 'MAPS' | 'POSTS' | 'SERVERS';

export type UserRole = 'ADMIN' | 'USER' | 'SHAR' | 'SERVER' | 'BOT';

export type LikeAction = 'LIKE' | 'DISLIKE';
