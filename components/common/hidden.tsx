import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { ReactNode } from 'react';

export const Hidden = ({ children }: { children: ReactNode }) => (
  <VisuallyHidden.Root>{children}</VisuallyHidden.Root>
);
