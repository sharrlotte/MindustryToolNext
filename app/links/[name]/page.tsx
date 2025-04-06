import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { formatTitle, generateAlternate } from '@/lib/utils';

const links: Record<string, { href: string; title: string; description: string }> = {
  'mindustry-tool-vn': { href: 'https://discord.gg/9qMxQZm6Wb', title: 'Discord MindustryTool Việt Name', description: 'Tham gia vào máy chủ của Mindustry Việt Nam' },
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
    alternates: generateAlternate(`/links/${name}`),
  };
}

export function generateStaticParams() {
  return Object.keys(links).map((name) => ({ name }));
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  const item = links[name];

  if (!item) {
    notFound();
  }

  redirect(item.href);
}
