import ModalLayout from '@/layout/modal-layout';
import ProtectedRoute from '@/layout/protected-route';
import { getSession } from 'next-auth/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  modal: ReactNode;
};

export default async function Layout({ children, modal }: Props) {
  const session = await getSession();
  return (
    <ProtectedRoute session={session}>
      <ModalLayout modal={modal}>{children}</ModalLayout>
    </ProtectedRoute>
  );
}
