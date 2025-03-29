import { redirect } from 'next/navigation';

const links: Record<string, string> = {
  'mindustry-tool-vn': 'https://discord.gg/9qMxQZm6Wb',
};

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  const href = links[name];

  if (!href) {
    return <div className="inset-0 fixed flex items-center justify-center text-center text-destructive-foreground">Invalid link</div>;
  }

  redirect(href);
}
