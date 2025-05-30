import PaginationNavigator from '@/components/common/pagination-navigator';
import usePathId from '@/hooks/use-path-id';


export default function BuildDestroyListFooter() {
	const id = usePathId();
	return (
		<PaginationNavigator queryKey={['server', id, 'building-destroy-log']} numberOfItems={`/servers/${id}/build-log/count`} />
	);
}
