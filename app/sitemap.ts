import env from '@/constant/env';
import { MetadataRoute } from 'next';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['schematics', 'maps', 'posts', 'servers', 'upload'];

  return routes.reduce<MetadataRoute.Sitemap>((prev, curr) => {
    for (let lang of env.locales) {
      prev.push({
        url: path.join(env.url.base, lang, curr),
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      });
    }
    return prev;
  }, []);
}
