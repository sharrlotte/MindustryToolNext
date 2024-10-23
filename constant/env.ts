import { locales } from '@/i18n/config';
import SortTag from '@/types/response/SortTag';

const env = {
  webVersion: 'v1.1.1',
  webName: 'Mindustry Tool',
  locales: locales,
  defaultLocale: 'en',
  imageFormat: '.webp',
  requestTimeout: parseInt(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT || '0') || 9000,
  url: {
    socket: process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL as string,
    base: process.env.NEXT_PUBLIC_FRONTEND_URL as string,
    api: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    image: process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_URL as string,
  },
};

export default env;

export const defaultSortTag: SortTag = 'time_1';
