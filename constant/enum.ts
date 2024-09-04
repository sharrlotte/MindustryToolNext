export type LogType =
  | 'SYSTEM'
  | 'DATABASE'
  | 'API'
  | 'DISCORD_MESSAGE'
  | 'REQUEST'
  | 'USER_LOGIN';

export type MetricType =
  | 'DAILY_LIKE'
  | 'DAILY_USER'
  | 'LOGGED_DAILY_USER'
  | 'DAILY_MOD_USER'
  | 'DAILY_WEB_USER'
  | 'DAILY_SERVER_USER';

export type UserRole = 'ADMIN' | 'USER' | 'SHAR' | 'CONTRIBUTOR';

export type LikeAction = 'LIKE' | 'DISLIKE';
