import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { formatTitle } from '@/lib/utils';

const links: Record<string, { href: string; title: string; description: string }> = {
  'mindustry-vietnam': {
    href: 'https://discord.gg/9qMxQZm6Wb',
    title: 'Discord MindustryTool Việt Nam',
    description: 'Tham gia vào máy chủ của Mindustry Việt Nam',
  },
  'mindustry-tool': {
    href: 'https://discord.gg/YGuBQ3g9fQ',
    title: 'Mindustry Tool',
    description:
      'Join our active Mindustry community to connect with fellow players, share experiences, get support, and collaborate on exciting development projects. Let’s grow together!',
  },
  'new-horizon': {
    href: 'https://discord.gg/aRRwAMDeEs',
    title: 'New Horizon Mod',
    description: 'Join our New Horizon Mod support and development server',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;

  const item = links[name];

  if (!item) {
    notFound();
  }

  const { title, description } = item;

  return {
    title: formatTitle(title),
    description,
    openGraph: {
      title: formatTitle(title),
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  const item = links[name];

  if (!item) {
    notFound();
  }

  redirect(item.href);
}
