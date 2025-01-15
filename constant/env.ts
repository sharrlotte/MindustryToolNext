import SortTag from '@/types/response/SortTag';

const env = {
  webName: 'Mindustry Tool',
  locales: ['en', 'vi', 'kr', 'cn', 'jp', 'ru', 'uk'] as const,
  defaultLocale: 'en',
  imageFormat: '.webp',
  requestTimeout: parseInt(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT || '0') || 2000,
  url: {
    socket: process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL as string,
    base: process.env.NEXT_PUBLIC_FRONTEND_URL as string,
    api: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    image: process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_URL as string,
  },
  supportedImageFormat: ['jpg', 'jpeg', 'png', 'webp'],
};

export default env;

export const defaultSortTag: SortTag = 'time_desc';
