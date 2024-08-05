import { FacebookIcon, GithubIcon } from 'lucide-react';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';

import {
  HomeMapPreview,
  HomeSchematicPreview,
  InformationGroup,
} from '@/app/[locale]/home';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';

import { DiscordLogoIcon } from '@radix-ui/react-icons';

export const dynamicParams = false;
export const experimental_ppr = true;

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  await setStaticParamsLocale(locale);

  return (
    <div className="flex flex-col no-scrollbar h-full overflow-y-auto bg-[url(https://mindustrygame.github.io/1.d25af17a.webp)] bg-cover bg-center text-white">
      <div className="flex flex-col gap-10 backdrop-brightness-50 backdrop-blur-sm w-full p-4 md:px-32 mx-auto">
        <div>
          <h1 className="w-full font-extrabold text-3xl text-center">
            <Tran text="home.hero-title" />
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex md:w-1/2 flex-col space-y-4">
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
          <div className="flex justify-center w-full md:w-1/2">
            <div className="relative w-full pb-[56.25%]">
              <iframe
                title="YouTube video player"
                className="absolute top-0 left-0 w-full h-full rounded-md"
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
        <div className="flex flex-col md:flex-row w-full gap-2">
          <div className="flex w-full md:w-1/2 flex-col">
            <h1 className="flex ml-4 mb-2.5 text-xl">
              <Tran text="home.content-recommended-article" />
            </h1>
            <ul className="flex flex-col mb-5">
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

            <h1 className="flex ml-4 mb-2.5 text-xl">
              <Tran text="home.community" />
            </h1>
            <ul className="flex flex-col mb-5">
              <li className="p-0">
                <a
                  className="text-brand hover:text-brand text-lg"
                  href="https://discord.gg/mindustry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tran text="home.official-discord-server" />
                </a>
              </li>
              <li className="p-0">
                <a
                  className="text-brand hover:text-brand text-lg"
                  href="https://discord.gg/DCX5yrRUyp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tran text="home.vietnamese-discord-server" />
                </a>
              </li>
              <li className="p-0">
                <a
                  className="text-brand hover:text-brand text-lg"
                  href="https://www.reddit.com/r/Mindustry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tran text="home.reddit" />
                </a>
              </li>
            </ul>
            <h1 className="flex ml-4 mb-2.5 text-xl">
              <Tran text="home.youtube" />
            </h1>
            <ul className="flex flex-col mb-5">
              <li className="p-0">
                <a
                  className="text-brand hover:text-brand text-lg"
                  href="https://www.youtube.com/@FourEverNice"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Four Ever Nice
                </a>
              </li>
              <li className="p-0">
                <a
                  className="text-brand hover:text-brand text-lg"
                  href="http://www.youtube.com/@gezpil8397"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gezpil
                </a>
              </li>
            </ul>
          </div>
          <div className="flex w-full md:w-1/2 flex-col">
            <h1 className="flex ml-4 mb-5 text-xl">
              <Tran text="home.website-info" />
            </h1>
            <InformationGroup />
          </div>
        </div>
      </div>
      <footer className="bg-zinc-950/95">
        <div className="pb-6 p-6 space-y-4">
          <span className="text-center w-full flex justify-center text-2xl ">
            MindustryTool
          </span>
          <div className="flex justify-center gap-2">
            <Link
              className="bg-black rounded-full p-2 aspect-square border"
              href="https://github.com/MindustryVN"
            >
              <GithubIcon className="size-5" />
            </Link>
            <Link
              className="bg-[rgb(66,103,178)] rounded-full p-2 aspect-square border"
              href="https://www.facebook.com/groups/544598159439216/"
            >
              <FacebookIcon className="size-5" />
            </Link>
            <Link
              className="bg-[rgb(88,101,242)] rounded-full p-2 aspect-square border"
              href="https://discord.gg/72324gpuCd"
            >
              <DiscordLogoIcon className="size-5" />
            </Link>
          </div>
        </div>
        <div className="flex w-full bg-black text-sm text-center justify-center p-4">
          Copyright © 2024 ‧ MindustryTool. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
