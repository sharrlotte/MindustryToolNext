import { ReactNode } from 'react';

import { Filter, hasAccess, isError } from '@/lib/utils';
import { Session } from '@/types/response/Session';
import { ApiError } from '@/action/action';

type Props = {
  filter?: Filter;
  session: Session | null | ApiError;
  alt?: ReactNode;
  children: ReactNode;
};

export default function ProtectedElement({ children, alt, filter, session }: Props) {
  if (isError(session)) {
    return alt;
  }

  return hasAccess(session, filter) ? children : alt;
}
