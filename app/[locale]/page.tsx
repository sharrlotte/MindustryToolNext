import { Book, Cpu, DownloadIcon, FileCode, Flame, Gamepad2, Github, Globe, MapIcon, MessageSquareIcon, MessagesSquare, PlayIcon, RocketIcon, Server, ServerIcon, Sparkles, UserPlusIcon, YoutubeIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import 'server-only';

import { HomeMapPreview, HomeSchematicPreview, HomeServerPreview, OnlineDisplay } from '@/app/[locale]/home';

import { DiscordIcon, FacebookIcon, GithubIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import T from '@/components/common/server-tran';
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

const links = [
  {
    key: 'home.offcial',
    icon: MessagesSquare,
    color: '-cyan-400',
    value: [
      {
        href: 'https://discord.gg/mindustry',
        text: 'home.official-discord-server',
        icon: DiscordIcon,
        class: 'min-w-8 h-8 text-[#5865F2]',
      },
      {
        href: 'https://mindustrygame.github.io/wiki/',
        text: 'home.mindustry-wiki',
        icon: Book,
        class: 'min-w-8 h-8 text-blue-500',
      },
      {
        href: 'https://github.com/Anuken/Mindustry',
        text: 'home.mindustry-github',
        icon: Github,
        class: 'min-w-8 h-8 text-gray-700',
      },
    ],
  },
  {
    key: 'home.mindustrytool-and-vietnam',
    icon: MessagesSquare,
    color: '-brand',
    value: [
      {
        href: 'https://discord.gg/nQDrEHVkrt',
        text: 'home.mindustry-tool-discord-server',
        icon: DiscordIcon,
        class: 'min-w-8 h-8 text-[#5865F2]',
      },
      {
        href: 'https://discord.gg/DCX5yrRUyp',
        text: 'home.vietnamese-discord-server',
        icon: DiscordIcon,
        class: 'min-w-8 h-8 text-[#5865F2]',
      },
      {
        href: 'https://www.youtube.com/@FourEverNice',
        text: 'Four Ever Nice',
        icon: YoutubeIcon,
        class: 'min-w-8 h-8 text-red-600',
      },
      {
        href: 'http://www.youtube.com/@gezpil8397',
        text: 'Gezpil',
        icon: YoutubeIcon,
        class: 'min-w-8 h-8 text-red-600',
      },
    ],
  },
  {
    key: 'home.suggested-posts',
    icon: MessageSquareIcon,
    color: '-purple-400',
    value: [
      {
        href: 'posts/e7610862-bf57-4ab0-9204-ae7a4a31d41b',
        text: 'home.download-tutorial',
        icon: MessagesSquare,
        class: 'min-w-8 h-8',
      },
      {
        href: '/posts/fa6c9516-7b98-428d-9129-c86aa40ea3d6',
        text: 'home.play-with-friend-tutorial',
        icon: MessagesSquare,
        class: 'min-w-8 h-8',
      },
    ],
  },
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
    <T locale={locale} text={text} />
  </h1>
);

const commonClasses = {
  section: 'container mx-auto px-4',
  title: 'text-3xl font-bold mb-16 flex justify-center items-center',
  gradientText: 'bg-gradient-to-r from-brand to-cyan-400 bg-clip-text text-transparent',
  card: 'bg-card p-8 rounded-xl transition-all duration-300 ease-in-out flex flex-col',
  iconWrapper: 'w-16 h-16 rounded-lg flex items-center justify-center mb-6',
};

export default async function Page({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="no-scrollbar flex h-full flex-col bg-center text-foreground gap-16 px-4">
      {/* Header / Hero Section */}
      <header className="w-full px-4 bg-gradient-to-b from-background to-background/80">
        <div className="py-8">
          <div className={commonClasses.section}>
            <div className="grid">
              <T className={`w-full text-3xl md:text-5xl font-bold text-center mb-6 ${commonClasses.gradientText}`} locale={locale} text={'home.mindustrytool'} />
              <T className="w-full text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-6" locale={locale} text={'home.tagline'} />
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
              <Button className="h-12 px-6 text-base bg-brand hover:bg-brand/90 text-white transition duration-300 ease-in-out">
                <RocketIcon className="mr-2" />
                <T locale={locale} text="home.get-started" />
              </Button>
              <Button className="h-12 px-6 text-base border border-brand text-brand hover:bg-brand hover:text-white transition duration-300 ease-in-out" variant="outline">
                <PlayIcon className="mr-2" />
                <T locale={locale} text="home.explore-webpage" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-700 max-w-4xl mx-auto bg-card/50 rounded-lg p-4">
              {[
                { icon: FileCode, text: 'home.schematics-count', count: '4.5k+', color: 'text-brand' },
                { icon: MapIcon, text: 'home.maps-count', count: '1K+', color: 'text-cyan-400' },
                { icon: ServerIcon, text: 'home.free-servers-count', count: '3 Slots', color: 'text-purple-400' },
              ].map((item, index) => (
                <div key={index} className="text-center py-4">
                  <div className={`text-xl md:text-4xl font-bold ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-8 h-8 mr-2" />
                    {item.count}
                  </div>
                  <T locale={locale} text={item.text} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hot Features Section */}
      <section className="bg-background/50">
        <div className={commonClasses.section}>
          <div className={commonClasses.title}>
            <Flame className="text-red-400 w-8 h-8 mr-2" />
            <T locale={locale} text="home.hot-features" />
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: DownloadIcon,
                title: 'home.schematics-and-maps',
                description: 'home.find-what-you-need',
                color: 'brand',
              },
              {
                icon: Cpu,
                title: 'home.hot-mods-support',
                description: 'home.experience-hot-mods',
                color: 'cyan-400',
              },
              {
                icon: Server,
                title: 'home.free-servers',
                description: 'home.claim-free-server',
                color: 'purple-400',
              },
            ].map((feature, index) => (
              <div key={index} className={commonClasses.card}>
                <div className={`${commonClasses.iconWrapper} bg-${feature.color}/10`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <T className="text-xl font-bold mb-4 text-card-foreground" locale={locale} text={feature.title} />
                <T className="mb-4 text-muted-foreground flex-grow" locale={locale} text={feature.description} />
                <Button variant="outline" className={`${feature.color} border-${feature.color} hover:bg-${feature.color} hover:text-white transition-colors duration-300 w-full mt-4`}>
                  <T locale={locale} text="home.details" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-background">
        <div className={commonClasses.section}>
          <div className="grid grid-col md:grid-row-3 gap-4">
            <div className="grid md:grid-cols-2 bg-card p-8 rounded-xl transition-all duration-300 ease-in-out">
              <div className="grid pr-4">
                <div className={`${commonClasses.iconWrapper} bg-brand/10`}>
                  <Cpu className="w-8 h-8 text-brand" />
                </div>
                <T className="text-xl font-bold mb-4 text-card-foreground" locale={locale} text="home.about-mindustry" />
                <T className="mb-4 text-muted-foreground" locale={locale} text="home.mindustry-description" />
                <T className="mb-4 text-muted-foreground" locale={locale} text="home.mindustry-platforms" />
                <Button variant="link" className="text-brand flex justify-start px-0">
                  <T locale={locale} text="home.download-now" />
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-brand/20 bg-zinc-900/50">{/* TODO: Thêm nội dung video */}</div>
              </div>
            </div>

            <div className={commonClasses.card}>
              <div className={`${commonClasses.iconWrapper} bg-cyan-400/10`}>
                <Globe className="w-8 h-8 text-cyan-400" />
              </div>
              <T className="text-xl font-bold mb-4 text-card-foreground" locale={locale} text="home.about-webpage" />
              <T className="mb-4 text-muted-foreground" locale={locale} text="home.webpage-description" />
              <Button variant="link" className="text-brand flex justify-start px-0">
                <T locale={locale} text="home.explore-webpage" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Designs Section */}
      <section className="bg-background/50">
        <div className={commonClasses.section}>
          <div className={commonClasses.title}>
            <Sparkles className="w-8 h-8 mr-2 text-yellow-400 drop-shadow-xl" />
            <T className={`text-3xl font-bold ${commonClasses.gradientText}`} locale={locale} text="home.new-designs" />
          </div>
          <div className="grid gap-8">
            {[
              { title: 'home.new-schematics', icon: FileCode, color: 'text-brand', component: HomeSchematicPreview },
              { title: 'home.new-maps', icon: MapIcon, color: 'text-cyan-400', component: HomeMapPreview },
            ].map((item, index) => (
              <div key={index} className={`container overflow-hidden ${commonClasses.card}`}>
                <div className="rounded-lg overflow-hidden">
                  <h3 className="text-xl font-semibold mb-8 text-card-foreground flex items-center">
                    <item.icon className={`w-6 h-6 mr-2 ${item.color}`} />
                    <T locale={locale} text={item.title} />
                  </h3>
                  <div className="rounded-md no-scrollbar">
                    <item.component queryParam={{ page: 0, size: 3 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hosting Your Server Section */}
      <section className="bg-background p-4">
        <div className={`${commonClasses.section} bg-card p-8 rounded-xl shadow-lg gap-8`}>
          <div className="flex items-center mb-8">
            <Gamepad2 className="w-8 h-8 mr-2 text-blue-400 drop-shadow-xl" />
            <T className={`text-3xl font-bold ${commonClasses.gradientText}`} locale={locale} text="home.hosting-your-server" />
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="col-span-1">
              <h3 className="text-xl font-bold text-brand mb-4 flex items-center">
                <Server className="w-6 h-6 mr-2" />
                <T locale={locale} text="home.why-choose-us" />
              </h3>
              <p className="mb-6 text-muted-foreground">
                <T locale={locale} text="home.server-features" />
              </p>
              <Button variant="outline" className="text-brand border-brand hover:bg-brand hover:text-white transition-colors duration-300">
                <T locale={locale} text="home.claim-free-server" />
              </Button>
            </div>
            <div className="col-span-1">
              <div className="flex items-center mb-8">
                <Sparkles className="w-6 h-6 mr-2 text-yellow-400 drop-shadow-xl" />
                <T className="text-xl font-bold text-brand" locale={locale} text="home.recommend-gamemode" />
              </div>
              <div className="grid gap-8">
                {['a', 'b'].map((object, index) => (
                  <div key={index}>{object}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background p-4">
        <div className={`${commonClasses.section} bg-card rounded-xl shadow-lg p-8 overflow-hidden`}>
          <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center">
            <Globe className="w-6 h-6 mr-2" />
            <T locale={locale} text="home.mindustry-tool-servers" />
          </h3>
          <div className="no-scrollbar">
            <HomeServerPreview />
          </div>
        </div>
      </section>

      {/* Active Community Section */}
      <section className="bg-background/50">
        <div className={commonClasses.section}>
          <h2 className={`${commonClasses.title} text-card-foreground`}>
            <T locale={locale} text="home.active-community" />
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {links.map((section, index) => (
              <div key={index} className="bg-card rounded-xl p-6">
                <div className="flex min-h-16 items-center gap-4 mb-4">
                  <section.icon className={`w-8 h-8 ${section.color}`} />
                  <h3 className="text-xl font-bold text-card-foreground">
                    <T locale={locale} text={section.key} />
                  </h3>
                </div>
                <ul className="space-y-4">
                  {section.value.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex ml-0 items-center gap-4">
                      <item.icon className={item.class + " ml-2"} />
                      <InternalLink className="flex items-center hover:text-brand transition-colors duration-300" href={item.href}>
                        <T locale={locale} text={item.text} />
                      </InternalLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="bg-background">
        <div className={`${commonClasses.section} text-center`}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-card-foreground">
              <T locale={locale} text="home.ready-to-start" />
            </h2>
            <p className="mb-8 text-muted-foreground">
              <T locale={locale} text="home.register-and-join" />
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button className="h-12 px-6 text-base bg-brand hover:bg-brand/90 text-white transition duration-300 ease-in-out gap-2">
                <UserPlusIcon />
                <T locale={locale} text="home.register-now" />
              </Button>
              <Button className="h-12 px-6 text-base border border-brand text-brand hover:bg-brand hover:text-white transition duration-300 ease-in-out" variant="outline">
                <PlayIcon />
                <T locale={locale} text="home.start-exploring" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className={`${commonClasses.section} py-4`}>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Brand & Socials */}
            <div className="space-y-4 md:text-left">
              <h3 className="text-xl font-bold text-card-foreground">
                <T locale={locale} text="home.mindustrytool" />
              </h3>
              <div className="flex justify-center md:justify-start gap-2">
                {[
                  { href: 'https://github.com/MindustryVN', icon: GithubIcon, bg: 'bg-black' },
                  {
                    href: 'https://www.facebook.com/groups/544598159439216/',
                    icon: FacebookIcon,
                    bg: 'bg-[rgb(66,103,178)]',
                  },
                  { href: 'https://discord.gg/72324gpuCd', icon: DiscordIcon, bg: 'bg-[rgb(88,101,242)]' },
                ].map((social, index) => (
                  <Link key={index} className={`aspect-square rounded-full border ${social.bg} bg-opacity-30 p-2 transition-colors duration-300 hover:text-brand`} href={social.href}>
                    <social.icon />
                  </Link>
                ))}
              </div>
              <SectionTitle locale={locale} text="home.credit" />
              <div className="flex flex-col items-center md:items-start space-y-2">
                <Link className="text-brand hover:underline" href="/credit">
                  <T locale={locale} text="home.credit" />
                </Link>
                <Link className="text-brand hover:underline" href="https://discord.gg/72324gpuCd">
                  <T locale={locale} text="report" />
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="font-semibold text-card-foreground">
                <T locale={locale} text="home.legal" />
              </h3>
              <div className="space-y-2">
                <Link href="/terms" className="text-brand hover:underline">
                  <T locale={locale} text="home.terms-of-use" />
                </Link>
              </div>
            </div>

            {/* Resource */}
            <div className="space-y-4">
              <div className="font-semibold text-card-foreground">
                <SectionTitle locale={locale} text="home.resource" />
              </div>
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
