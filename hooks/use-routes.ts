import { groups } from '@/app/routes';

import { useSession } from '@/context/session-context';
import { hasAccess, isError } from '@/lib/utils';

export default function useRoutes() {
  const { session } = useSession();

  if (isError(session)) {
    return [];
  }

  return groups.filter((group) => hasAccess(session, group.filter) && group.paths.some(({ path, filter }) => hasAccess(session, filter) && (typeof path === 'string' ? true : path.some((sub) => hasAccess(session, sub.filter)))));
}
