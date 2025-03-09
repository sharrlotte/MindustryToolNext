import { ReactNode } from 'react';

import NavigationBar from '@/app/[locale]/navigation';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return <NavigationBar>{children}</NavigationBar>;
}
