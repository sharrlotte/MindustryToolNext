import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/v3/',
    },
    sitemap: 'https://mindustry-tool.com/sitemap.xml',
  };
}
