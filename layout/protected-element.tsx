import { ReactNode } from 'react';

import { UserRole } from '@/constant/enum';
import { hasAccess } from '@/lib/utils';
import { Session } from '@/types/response/Session';

type Props = {
  children: ReactNode;
  any?: UserRole[];
  all?: UserRole[];
  show?: boolean;
  ownerId?: string;
  session: Session | null;
  alt?: ReactNode;
  passOnEmpty?: boolean;
};

export default function ProtectedElement({ children, alt, ...props }: Props) {
  return hasAccess(props) ? children : alt;
}
