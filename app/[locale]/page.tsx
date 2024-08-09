import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';

import {
  HomeMapPreview,
  HomeSchematicPreview,
  InformationGroup,
} from '@/app/[locale]/home';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import {
  DiscordIcon,
  FacebookIcon,
  GithubIcon,
} from '@/components/common/icons';
import Image from 'next/image';
import Ads from '@/components/common/ads';

export const dynamicParams = false;
export const experimental_ppr = true;

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  await setStaticParamsLocale(locale);

  return (
    <div className="no-scrollbar flex h-full flex-col overflow-y-auto text-white">
      <Image
        className="fixed inset-0 bg-cover bg-center"
        src="https://mindustrygame.github.io/1.d25af17a.webp"
        fill
        priority
        alt="mindustry"
      />
      <div className="mx-auto flex w-full flex-col gap-10 p-4 backdrop-blur-sm backdrop-brightness-50 md:px-32">
        <div>
          <h1 className="w-full text-center text-3xl font-extrabold">
            <Tran text="home.hero-title" />
          </h1>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex flex-col space-y-4 md:w-1/2">
            <div>
              <h3 className="font-bold">
                <Tran text="home.content-what-is-mindustry" />
              </h3>
              <p className="text-foreground">
                <Tran text="home.content-about-mindustry" />
              </p>
            </div>
            <div>
              <h3 className="font-bold">
                <Tran text="home.content-platform-info" />
              </h3>
              <p>
                <Tran text="home.content-platform" />
              </p>
            </div>
            <div>
              <h3 className="font-bold">
                <Tran text="home.mindustry-tool-about" />
              </h3>
              <p>
                <Tran text="home.mindustry-tool-description" />
              </p>
            </div>
          </div>
          <div className="flex w-full justify-center md:w-1/2">
            <div className="relative w-full pb-[56.25%]">
              <iframe
                title="YouTube video player"
                className="absolute left-0 top-0 h-full w-full rounded-md"
                src="https://www.youtube.com/embed/gUu3AhqpyHo?autoplay=1&loop=1&controls=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; controls; loop;"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <h3 className="font-bold">
              <Tran text="home.schematic-preview" />
            </h3>
            <InternalLink
              className="cursor-pointer font-light"
              href="/schematics"
            >
              <Tran text="home.preview-more" />
            </InternalLink>
          </div>
          <HomeSchematicPreview
            queryParam={{ page: 0, size: 10, sort: 'time_1' }}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <h3 className="font-bold">
              <Tran text="home.map-preview" />
            </h3>
            <InternalLink href="/maps" className="cursor-pointer font-light">
              <Tran text="home.preview-more" />
            </InternalLink>
          </div>
          <HomeMapPreview queryParam={{ page: 0, size: 10, sort: 'time_1' }} />
        </div>
        <div className="flex w-full flex-col gap-2 md:flex-row">
          <div className="flex w-full flex-col md:w-1/2">
            <h1 className="mb-2.5 ml-4 flex text-xl">
              <Tran text="home.content-recommended-article" />
            </h1>
            <ul className="mb-5 flex flex-col">
              <li className="p-0">
                <InternalLink
                  className="text-lg"
                  variant="primary"
                  href="posts/e7610862-bf57-4ab0-9204-ae7a4a31d41b"
                >
                  <Tran text="home.download-tutorial" />
                </InternalLink>
              </li>
              <li className="p-0">
                <InternalLink
                  className="text-lg"
                  variant="primary"
                  href="/posts/fa6c9516-7b98-428d-9129-c86aa40ea3d6"
                >
                  <Tran text="home.play-with-friend-tutorial" />
                </InternalLink>
              </li>
            </ul>

            <h1 className="mb-2.5 ml-4 flex text-xl">
              <Tran text="home.community" />
            </h1>
            <ul className="mb-5 flex flex-col">
              <li className="p-0">
                <a
                  className="text-lg text-brand hover:text-brand"
                  href="https://discord.gg/mindustry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tran text="home.official-discord-server" />
                </a>
              </li>
              <li className="p-0">
                <a
                  className="text-lg text-brand hover:text-brand"
                  href="https://discord.gg/DCX5yrRUyp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tran text="home.vietnamese-discord-server" />
                </a>
              </li>
              <li className="p-0">
                <a
                  className="text-lg text-brand hover:text-brand"
                  href="https://www.reddit.com/r/Mindustry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tran text="home.reddit" />
                </a>
              </li>
            </ul>
            <h1 className="mb-2.5 ml-4 flex text-xl">
              <Tran text="home.youtube" />
            </h1>
            <ul className="mb-5 flex flex-col">
              <li className="p-0">
                <a
                  className="text-lg text-brand hover:text-brand"
                  href="https://www.youtube.com/@FourEverNice"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Four Ever Nice
                </a>
              </li>
              <li className="p-0">
                <a
                  className="text-lg text-brand hover:text-brand"
                  href="http://www.youtube.com/@gezpil8397"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gezpil
                </a>
              </li>
            </ul>
          </div>
          <div className="flex w-full flex-col md:w-1/2">
            <h1 className="mb-5 ml-4 flex text-xl">
              <Tran text="home.website-info" />
            </h1>
            <InformationGroup />
          </div>
        </div>
      </div>
      <footer className="z-10 bg-zinc-950/95">
        <div className="space-y-4 p-6 pb-6">
          <span className="flex w-full justify-center text-center text-2xl ">
            MindustryTool
          </span>
          <div className="flex justify-center gap-2">
            <Link
              className="aspect-square rounded-full border bg-black p-2"
              href="https://github.com/MindustryVN"
            >
              <GithubIcon />
            </Link>
            <Link
              className="aspect-square rounded-full border bg-[rgb(66,103,178)] p-2"
              href="https://www.facebook.com/groups/544598159439216/"
            >
              <FacebookIcon />
            </Link>
            <Link
              className="aspect-square rounded-full border bg-[rgb(88,101,242)] p-2"
              href="https://discord.gg/72324gpuCd"
            >
              <DiscordIcon />
            </Link>
          </div>
        </div>
        <div className="flex w-full justify-center bg-black p-4 text-center text-sm">
          Copyright © 2024 ‧ MindustryTool. All rights reserved.
        </div>
      </footer>
      <Ads />
    </div>
  );
}
