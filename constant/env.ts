import { z } from 'zod';

import SortTag from '@/types/response/SortTag';

const configSchema = z.object({
  webVersion: z.string(),
  locales: z.array(z.string()),
  defaultLocale: z.string(),
  url: z.object({
    socket: z.string(),
    base: z.string(),
    api: z.string(),
    image: z.string(),
  }),
});

const env = configSchema.parse({
  webVersion: 'v1.1.1',
  locales: ['vi', 'en'],
  defaultLocale: 'en',
  url: {
    socket: process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL,
    base: process.env.NEXT_PUBLIC_FRONTEND_URL,
    api: process.env.NEXT_PUBLIC_BACKEND_URL,
    image: process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_URL,
  },
});

export default env;

export const defaultSortTag: SortTag = 'time_1';
