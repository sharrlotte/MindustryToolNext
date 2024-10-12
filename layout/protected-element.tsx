import { ReactNode } from 'react';

import { UserRole } from '@/constant/enum';
import { hasAccess } from '@/lib/utils';
import { Session } from '@/types/response/Session';
import { ApiError } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';

type Props = {
  children: ReactNode;
  any?: UserRole[];
  all?: UserRole[];
  show?: boolean;
  ownerId?: string;
  session: Session | null | ApiError;
  alt?: ReactNode;
  passOnEmpty?: boolean;
};

export default function ProtectedElement({ children, alt, ...props }: Props) {
  const { session } = props;

  if (session && 'error' in session) {
    return <ErrorScreen error={session} />;
  }

  return hasAccess({ ...props, session }) ? children : alt;
}
