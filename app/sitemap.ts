import { MetadataRoute } from 'next';

import env from '@/constant/env';

const routes = ['schematics', 'maps', 'posts', 'servers', 'upload'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${env.url.base}/${route}`,
    alternates: {
      languages: Object.fromEntries(
        env.locales.map((lang) => [lang, `${env.url.base}/${lang}/${route}`]),
      ),
    },
  }));
}
