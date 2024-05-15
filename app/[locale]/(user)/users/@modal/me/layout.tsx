import { auth } from '@/auth/config';
import ProtectedRoute from '@/layout/protected-route';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await auth();
  return <ProtectedRoute session={session}>{children}</ProtectedRoute>;
}
