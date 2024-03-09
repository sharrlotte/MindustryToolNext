import React, { ReactNode } from 'react';

type ModalLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function ModalLayout({ children, modal }: ModalLayoutProps) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {children}
      {modal}
    </div>
  );
}
