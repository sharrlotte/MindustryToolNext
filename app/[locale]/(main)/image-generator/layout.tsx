import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="p-4"> {children}</div>;
}
