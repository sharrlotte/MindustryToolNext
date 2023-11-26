import cfg from "@/constant/global";
import NavigationBar from "./navigation";
import QueryProvider from "../query/config/query-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "../components/theme/theme-provider";
import { Monomaniac_One } from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";

const inter = Monomaniac_One({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "MindustryTool",
  description: "A website about mindustry",
};

type RootParam = {
  lang: string;
};

export async function generateStaticParams(): Promise<RootParam[]> {
  return cfg.locales.map((locale) => {
    return {
      lang: locale,
    };
  });
}

type RootProps = {
  children: React.ReactNode;
  params: RootParam;
};

export default function Root({ children, params }: RootProps) {
  return (
    <html lang={params.lang ?? "en"} suppressHydrationWarning className="dark">
      <body
        className={cn(
          "flex min-h-screen select-none flex-col bg-background antialiased",
          inter.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavigationBar />
          <Toaster />
          <div className="min-h-[calc(100vh-var(--nav-height))] w-full">
            <QueryProvider>{children}</QueryProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
