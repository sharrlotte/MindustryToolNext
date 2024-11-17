import { ReactNode } from 'react';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export const Hidden = ({ children }: { children: ReactNode }) => <VisuallyHidden.Root>{children}</VisuallyHidden.Root>;
