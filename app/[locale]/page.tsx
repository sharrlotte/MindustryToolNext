import { Book, Cpu, DownloadIcon, FileCode, Github, Globe, MapIcon, MessageSquareIcon, MessagesSquare, PlayIcon, RocketIcon, Server, ServerIcon, UserPlusIcon, YoutubeIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import 'server-only';

import { HomeMapPreview, HomeSchematicPreview, HomeServerPreview, InformationGroup, OnlineDisplay } from '@/app/[locale]/home';

import { DiscordIcon, FacebookIcon, GithubIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import ServerTran from '@/components/common/server-tran';
import { Button } from '@/components/ui/button';

import type { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';

export const experimental_ppr = true;

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

const official = [
  {
    href: 'https://discord.gg/mindustry',
    text: 'home.official-discord-server',
    icon: <DiscordIcon className="w-8 h-8 text-[#5865F2]" />,
  },
  {
    href: 'https://mindustrygame.github.io/wiki/',
    text: 'home.mindustry-wiki',
    icon: <Book className="w-8 h-8 text-blue-500" />,
  },
  {
    href: 'https://github.com/Anuken/Mindustry',
    text: 'home.mindustry-github',
    icon: <Github className="w-8 h-8 text-gray-700" />,
  },
];

const unofficial = [
  {
    href: 'https://discord.gg/nQDrEHVkrt',
    text: 'home.mindustry-tool-discord-server',
    icon: <DiscordIcon className="w-8 h-8 text-[#5865F2]" />,
  },
  {
    href: 'https://discord.gg/DCX5yrRUyp',
    text: 'home.vietnamese-discord-server',
    icon: <DiscordIcon className="w-8 h-8 text-[#5865F2]" />,
  },
  {
    href: 'https://www.youtube.com/@FourEverNice',
    text: 'Four Ever Nice',
    icon: <YoutubeIcon className="w-8 h-8 text-red-600" />,
  },
  {
    href: 'http://www.youtube.com/@gezpil8397',
    text: 'Gezpil',
    icon: <YoutubeIcon className="w-8 h-8 text-red-600" />,
  },
];

const posts = [
  { href: 'posts/e7610862-bf57-4ab0-9204-ae7a4a31d41b', text: 'home.download-tutorial' },
  { href: '/posts/fa6c9516-7b98-428d-9129-c86aa40ea3d6', text: 'home.play-with-friend-tutorial' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = t('home');

  return {
    title: formatTitle(title),
  };
}

const SectionTitle = ({ text, locale }: { text: string; locale: Locale }) => (
  <h1 className="flex text-xl font-extrabold">
    <ServerTran locale={locale} text={text} />
  </h1>
);

export default async function Page({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="no-scrollbar flex h-full flex-col bg-center text-foreground gap-6">
      {/* Header / Hero Section */}
      <header className="w-full px-4 bg-gradient-to-b from-background to-background/80">
        <div className="py-8">
          <div className="container mx-auto px-4 text-center">
            <ServerTran className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand to-cyan-400 bg-clip-text text-transparent" locale={locale} text={'home.mindustrytool'} />
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              <ServerTran locale={locale} text={'home.tagline'} />
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
              <Button className="h-12 px-6 text-base bg-brand hover:bg-brand/90 text-white transition duration-300 ease-in-out">
                <RocketIcon className="mr-2" />
                <ServerTran locale={locale} text="home.get-started" />
              </Button>
              <Button className="h-12 px-6 text-base border border-brand text-brand hover:bg-brand hover:text-white transition duration-300 ease-in-out" variant="outline">
                <PlayIcon className="mr-2" />
                <ServerTran locale={locale} text="home.explore-webpage" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-700 max-w-4xl mx-auto bg-card/50 rounded-lg p-4">
              <div className="text-center py-4">
                <div className="text-xl md:text-4xl font-bold text-brand flex items-center justify-center">
                  <FileCode className="w-8 h-8 mr-2" />
                  4.5k+
                </div>
                <ServerTran locale={locale} text="home.schematics-count" />
              </div>
              <div className="text-center py-4">
                <div className="text-xl md:text-4xl font-bold text-cyan-400 flex items-center justify-center">
                  <MapIcon className="w-8 h-8 mr-2" />
                  1K+
                </div>
                <ServerTran locale={locale} text="home.maps-count" />
              </div>
              <div className="text-center py-4">
                <div className="text-xl md:text-4xl font-bold text-purple-400 flex items-center justify-center">
                  <ServerIcon className="w-8 h-8 mr-2" />3 Slots
                </div>
                <ServerTran locale={locale} text="home.free-servers-count" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hot Features Section */}
      <section className="py-10 bg-background/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            <ServerTran locale={locale} text="home.hot-features" />
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-card p-8 rounded-xl border border-border hover:border-brand transition-all duration-300 ease-in-out flex flex-col">
              <div className="w-16 h-16 bg-brand/10 rounded-lg flex items-center justify-center mb-6">
                <DownloadIcon className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground">
                <ServerTran locale={locale} text="home.schematics-and-maps" />
              </h3>
              <p className="mb-4 text-muted-foreground flex-grow">
                <ServerTran locale={locale} text="home.find-what-you-need" />
              </p>
              <Button variant="outline" className="text-brand border-brand hover:bg-brand hover:text-white transition-colors duration-300 w-full mt-4">
                <ServerTran locale={locale} text="home.details" />
              </Button>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border hover:border-cyan-400 transition-all duration-300 ease-in-out flex flex-col">
              <div className="w-16 h-16 bg-cyan-400/10 rounded-lg flex items-center justify-center mb-6">
                <Cpu className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground">
                <ServerTran locale={locale} text="home.hot-mods-support" />
              </h3>
              <p className="mb-4 text-muted-foreground flex-grow">
                <ServerTran locale={locale} text="home.experience-hot-mods" />
              </p>
              <Button variant="outline" className="text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-white transition-colors duration-300 w-full mt-4">
                <ServerTran locale={locale} text="home.details" />
              </Button>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border hover:border-purple-400 transition-all duration-300 ease-in-out flex flex-col">
              <div className="w-16 h-16 bg-purple-400/10 rounded-lg flex items-center justify-center mb-6">
                <Server className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground">
                <ServerTran locale={locale} text="home.free-servers" />
              </h3>
              <p className="mb-4 text-muted-foreground flex-grow">
                <ServerTran locale={locale} text="home.claim-free-server" />
              </p>
              <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white transition-colors duration-300 w-full mt-4">
                <ServerTran locale={locale} text="home.details" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            <div className="grid md:grid-cols-2 bg-card p-8 rounded-xl border border-border hover:border-brand transition-all duration-300 ease-in-out">
              <div className="pr-4">
                <div className="w-16 h-16 bg-brand/10 rounded-lg flex items-center justify-center mb-6">
                  <Cpu className="w-8 h-8 text-brand" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-card-foreground">
                  <ServerTran locale={locale} text="home.about-mindustry" />
                </h3>
                <p className="mb-4 text-muted-foreground">
                  <ServerTran locale={locale} text="home.mindustry-description" />
                </p>
                <p className="mb-4 text-muted-foreground">
                  <ServerTran locale={locale} text="home.mindustry-platforms" />
                </p>
                <Button variant="link" className="text-brand p-0">
                  <ServerTran locale={locale} text="home.download-now" />
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-brand/20 bg-zinc-900/50">{/* TODO: Thêm nội dung video */}</div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border hover:border-cyan-400 transition-all duration-300 ease-in-out">
              <div className="w-16 h-16 bg-cyan-400/10 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground">
                <ServerTran locale={locale} text="home.about-webpage" />
              </h3>
              <p className="mb-4 text-muted-foreground">
                <ServerTran locale={locale} text="home.webpage-description" />
              </p>
              <Button variant="link" className="text-brand p-0">
                <ServerTran locale={locale} text="home.explore-webpage" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Designs Section */}
      <section className="py-10 px-4 bg-background/50">
        <div className="container mx-auto bg-card p-4 rounded-xl shadow-lg">
          <div className="p-4">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-brand to-cyan-400 bg-clip-text text-transparent">
              <ServerTran locale={locale} text="home.new-designs" />
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              <ServerTran locale={locale} text="home.new-design-propties" />
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-brand/10 p-2 rounded-lg overflow-hidden">
              <h3 className="text-xl font-semibold mb-4 text-card-foreground flex items-center">
                <FileCode className="w-6 h-6 mr-2 text-brand" />
                <ServerTran locale={locale} text="home.new-schematics" />
              </h3>
              <div className="rounded-md no-scrollbar">
                <HomeSchematicPreview queryParam={{ page: 0, size: 3 }} />
              </div>
            </div>
            <div className="bg-cyan-400/10 p-2 rounded-lg overflow-hidden">
              <h3 className="text-xl font-semibold mb-4 text-card-foreground flex items-center">
                <MapIcon className="w-6 h-6 mr-2 text-cyan-400" />
                <ServerTran locale={locale} text="home.new-maps" />
              </h3>
              <div className="rounded-md no-scrollbar">
                <HomeMapPreview queryParam={{ page: 0, size: 3 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hosting Your Server Section */}
      <section className="py-10 px-4 bg-background">
        <div className="container mx-auto bg-card p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-brand to-cyan-400 bg-clip-text text-transparent">
            <ServerTran locale={locale} text="home.hosting-your-server" />
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="col-span-1">
              <h3 className="text-2xl font-bold text-brand mb-4 flex items-center">
                <Server className="w-6 h-6 mr-2" />
                <ServerTran locale={locale} text="home.why-choose-us" />
              </h3>
              <p className="mb-6 text-muted-foreground">
                <ServerTran locale={locale} text="home.server-features" />
              </p>
              <Button variant="outline" className="text-brand border-brand hover:bg-brand hover:text-white transition-colors duration-300">
                <ServerTran locale={locale} text="home.claim-free-server" />
              </Button>
            </div>
            <div className="col-span-2 overflow-hidden">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2" />
                <ServerTran locale={locale} text="home.mindustry-tool-servers" />
              </h3>
              <div className="rounded-lg bg-cyan-400/10 p-2 no-scrollbar">
                <HomeServerPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Community Section */}
      <section className="py-10 px-4 bg-background/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-card-foreground">
            <ServerTran locale={locale} text="home.active-community" />
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex min-h-16 items-center gap-4 mb-4">
                <MessagesSquare className="w-8 h-8 text-[#5865F2]" />
                <h3 className="text-xl font-bold text-card-foreground">
                  <ServerTran locale={locale} text="home.official" />
                </h3>
              </div>
              <ul className="space-y-4">
                {official.map((object, index) => (
                  <li className="flex ml-0 items-center gap-4" key={index}>
                    <InternalLink className="flex items-center hover:text-brand transition-colors duration-300" href={object.href}>
                      <span className="w-8 h-8">{object.icon}</span>
                      <ServerTran locale={locale} text={object.text} />
                    </InternalLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex min-h-16 items-center gap-4 mb-4">
                <MessagesSquare className="w-8 h-8 text-[#5865F2]" />
                <h3 className="text-xl font-bold text-card-foreground">
                  <ServerTran locale={locale} text="home.mindustrytool-and-vietnam" />
                </h3>
              </div>
              <ul className="space-y-4">
                {unofficial.map((object, index) => (
                  <li className="flex ml-0 items-center gap-4" key={index}>
                    <InternalLink className="flex items-center hover:text-brand transition-colors duration-300" href={object.href}>
                      <span className="w-8 h-8">{object.icon}</span>
                      <ServerTran locale={locale} text={object.text} />
                    </InternalLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex min-h-16 items-center gap-4 mb-4">
                <MessageSquareIcon className="w-8 h-8 text-brand" />
                <h3 className="text-xl font-bold text-card-foreground">
                  <ServerTran locale={locale} text="home.suggested-posts" />
                </h3>
              </div>
              <ul className="space-y-4">
                {posts.map((object, index) => (
                  <li key={index}>
                    <InternalLink className="hover:text-brand transition-colors duration-300" href={object.href}>
                      <ServerTran locale={locale} text={object.text} />
                    </InternalLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-10 px-4 bg-background">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-card-foreground">
              <ServerTran locale={locale} text="home.ready-to-start" />
            </h2>
            <p className="mb-8 text-muted-foreground">
              <ServerTran locale={locale} text="home.register-and-join" />
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button className="h-12 px-6 text-base bg-brand hover:bg-brand/90 text-white transition duration-300 ease-in-out gap-2">
                <UserPlusIcon />
                <ServerTran locale={locale} text="home.register-now" />
              </Button>
              <Button className="h-12 px-6 text-base border border-brand text-brand hover:bg-brand hover:text-white transition duration-300 ease-in-out" variant="outline">
                <PlayIcon />
                <ServerTran locale={locale} text="home.start-exploring" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Brand & Socials */}
            <div className="space-y-4 md:text-left">
              <h3 className="text-xl font-bold text-card-foreground">
                <ServerTran locale={locale} text="home.mindustrytool" />
              </h3>
              <div className="flex justify-center md:justify-start gap-2">
                <Link className="aspect-square rounded-full border bg-black bg-opacity-30 p-2 transition-colors duration-300 hover:text-brand" href="https://github.com/MindustryVN">
                  <GithubIcon />
                </Link>
                <Link className="aspect-square rounded-full border bg-[rgb(66,103,178)] bg-opacity-30 p-2 transition-colors duration-300 hover:text-brand" href="https://www.facebook.com/groups/544598159439216/">
                  <FacebookIcon />
                </Link>
                <Link className="aspect-square rounded-full border bg-[rgb(88,101,242)] bg-opacity-30 p-2 transition-colors duration-300 hover:text-brand" href="https://discord.gg/72324gpuCd">
                  <DiscordIcon />
                </Link>
              </div>
              <SectionTitle locale={locale} text="home.credit" />
              <div className="flex flex-col items-center md:items-start space-y-2">
                <Link className="text-brand hover:underline" href="/credit">
                  <ServerTran locale={locale} text="home.credit" />
                </Link>
                <Link className="text-brand hover:underline" href="https://discord.gg/72324gpuCd">
                  <ServerTran locale={locale} text="report" />
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="font-semibold text-card-foreground">
                <ServerTran locale={locale} text="home.legal" />
              </h3>
              <div className="space-y-2">
                <Link href="/terms" className="text-brand hover:underline">
                  <ServerTran locale={locale} text="home.terms-of-use" />
                </Link>
              </div>
            </div>

            {/* Server Status */}
            <div className="space-y-4">
              <div className="font-semibold text-card-foreground">
                <SectionTitle locale={locale} text="home.website-info" />
              </div>
              <InformationGroup />
              <OnlineDisplay />
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>Copyright © 2024 ‧ MindustryTool. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
