import SortTag from '@/types/response/SortTag';

const env = {
  webVersion: 'v1.1.1',
  webName: 'Mindustry Tool',
  locales: ['vi', 'en'],
  defaultLocale: 'en',
  url: {
    socket: process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL as string,
    base: process.env.NEXT_PUBLIC_FRONTEND_URL as string,
    api: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    image: process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_URL as string,
  },
};

export default env;

export const defaultSortTag: SortTag = 'time_1';
    