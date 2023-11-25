import { z } from 'zod';

export const sortSchema = z.enum(['time_1', 'time_-1', 'like_1']).default('time_1');
