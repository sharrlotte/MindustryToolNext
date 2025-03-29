import { ReactNode } from 'react';

export default async function Root({ children }: { children: ReactNode }) {
  return (
    <html className="dark h-full w-full overflow-hidden bg-background text-foreground antialiased" data-color-mode="dark" suppressHydrationWarning>
      <body className="h-full w-full overflow-hidden">{children}</body>
    </html>
  );
}
