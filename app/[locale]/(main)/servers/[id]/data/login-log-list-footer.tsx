'use client';

import PaginationNavigator from '@/components/common/pagination-navigator';

import usePathId from '@/hooks/use-path-id';

export default function LoginLogListFooter() {
	const id = usePathId();

	return <PaginationNavigator queryKey={['server', id, 'login']} numberOfItems={`/servers/${id}/logins/count`} />;
}
