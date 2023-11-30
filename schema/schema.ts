import { defaultSortTag } from '@/constant/global';
import { sortTag } from '@/types/SortTag';
import { z } from 'zod';

export const sortSchema = z.enum(sortTag).default(defaultSortTag);
