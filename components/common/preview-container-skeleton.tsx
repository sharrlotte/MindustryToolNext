import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function PreviewContainerSkeleton({ children }: Props) {
  return <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2">{children}</div>;
}
