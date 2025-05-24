import useServer from '@/hooks/use-server';

export default function useServerStatus(id: string) {
	const { data } = useServer(id);
	const enabled = data && (data.status === 'HOST' || data.status === 'UP');

	return enabled ? 'AVAILABLE' : 'UNAVAILABLE';
}
