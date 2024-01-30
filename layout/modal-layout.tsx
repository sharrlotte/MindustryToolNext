import React, { ReactNode } from 'react';

type ModalLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function ModalLayout({ children, modal }: ModalLayoutProps) {
  console.log({ modal });
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      {children}
      {modal}
    </div>
  );
}
