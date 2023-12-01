import env from "@/constant/env";
import NavigationBar from "./navigation";
import QueryProvider from "../query/config/query-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "../components/theme/theme-provider";
import { Monomaniac_One } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";

import "./globals.css";
import ClientInit from "@/app/client-init";

const inter = Monomaniac_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "MindustryTool",
  description: "A website about mindustry",
};

type RootParam = {
  lang: string;
};

export async function generateStaticParams(): Promise<RootParam[]> {
  return env.locales.map((locale) => {
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
    <html
      lang={params.lang ?? "en"}
      suppressHydrationWarning
      className="dark flex min-h-screen select-none flex-col overflow-x-hidden bg-background antialiased"
    >
      <body className={cn(inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader height={4} showSpinner={false} />
          <NavigationBar />
          <ClientInit/>
          <Toaster />
          <div className="flex min-h-[calc(100vh-var(--nav-height))] w-full flex-col p-4">
            <QueryProvider>{children}</QueryProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
