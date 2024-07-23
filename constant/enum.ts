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
  | 'DAILY_MOD_USER'
  | 'DAILY_WEB_USER';


export type UserRole =
  | 'ADMIN'
  | 'USER'
  | 'SHAR'
  | 'SERVER'
  | 'BOT'
  | 'CONTRIBUTOR';

export type LikeAction = 'LIKE' | 'DISLIKE';
