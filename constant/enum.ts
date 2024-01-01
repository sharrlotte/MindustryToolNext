export type LogCollection =
  | 'system'
  | 'database'
  | 'api'
  | 'discord_message'
  | 'request'
  | 'user_login';

export type MetricCollection =
  | 'daily_like'
  | 'daily_user'
  | 'logged_daily_user';

export type LikeCollection = 'schematics' | 'maps' | 'posts';

export type UserRole = 'ADMIN' | 'USER';
