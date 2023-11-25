"use client";

import cfg from "@/constant/global";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "../components/theme/theme-switcher";
import { HTMLAttributes, ReactNode, useState } from "react";
import {
  Bars3Icon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  MapIcon,
  ServerStackIcon,
  CommandLineIcon,
} from "@heroicons/react/24/solid";
import OutsideWrapper from "@/components/ui/outside-wrapper";

export default function NavigationBar() {
  const pathName = usePathname();
  const route = pathName.split("/").filter((item) => item)[1];

  const [isSidebarVisible, setSidebarVisibility] = useState(false);

  const showSidebar = () => setSidebarVisibility(true);
  const hideSidebar = () => setSidebarVisibility(false);

  return (
    <div className="ro r sticky top-0 z-50 flex w-full justify-between bg-slate-500 dark:bg-emerald-500">
      <Button
        title="menu"
        type="button"
        variant="link"
        size="icon"
        onFocus={showSidebar}
        onClick={showSidebar}
        onMouseEnter={showSidebar}
      >
        <Bars3Icon className="h-6 w-6" />
      </Button>
      <OutsideWrapper
        className={cn(
          "fixed bottom-0 top-0 flex h-full min-w-[200px] translate-x-[-100%] flex-col justify-between overflow-hidden border-r-[1px] border-border bg-background px-2 transition-all duration-100",
          {
            "translate-x-0 duration-300": isSidebarVisible,
          },
        )}
        onClickOutside={hideSidebar}
      >
        <section onMouseLeave={hideSidebar}>
          <div className="flex flex-col gap-1">
            <span className="bg-gradient-to-r from-emerald-400 to-sky-500 bg-clip-text px-1 text-3xl font-bold uppercase text-transparent">
              MindustryTool
            </span>
            <span className="rounded-md px-1 font-bold">{cfg.webVersion}</span>
            <section className="grid gap-1">
              {paths.map((item, index) => (
                <NavItem
                  enabled={
                    item.path.slice(1) === route ||
                    (item.path === "/" && route === undefined)
                  }
                  key={index}
                  onClick={hideSidebar}
                  {...item}
                />
              ))}
            </section>
          </div>
        </section>
      </OutsideWrapper>
      <ThemeSwitcher />
    </div>
  );
}

interface Path {
  path: string;
  name: ReactNode;
  icon: ReactNode;
  enabled?: boolean;
}

interface NavItemProps extends Path, HTMLAttributes<HTMLAnchorElement> {
  onClick: () => void;
}

function NavItem({
  className,
  icon,
  path,
  name,
  enabled,
  onClick,
}: NavItemProps) {
  return (
    <Link
      className={cn(
        "flex gap-2 rounded-md px-1 py-2 font-bold hover:bg-slate-600",
        className,
        {
          "bg-slate-600": enabled,
        },
      )}
      href={path}
      onClick={onClick}
      scroll={false}
    >
      {icon} {name}
    </Link>
  );
}

const paths: Path[] = [
  {
    path: "/", //
    name: "Home",
    icon: <HomeIcon className="h-6 w-6" />,
  },
  {
    path: "/schematics", //
    name: "Schematic",
    icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
  },
  {
    path: "/maps",
    name: "Map",
    icon: <MapIcon className="h-6 w-6" />,
  },
  {
    path: "/posts", //
    name: "Post",
    icon: <BookOpenIcon className="h-6 w-6" />,
  },
  {
    path: "/servers", //
    name: "Server",
    icon: <ServerStackIcon className="h-6 w-6" />,
  },
  {
    path: "/logic", //
    name: "Logic",
    icon: <CommandLineIcon className="h-6 w-6" />,
  },
];
