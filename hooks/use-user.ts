import { Batcher } from '@/lib/batcher';
import { User } from '@/types/response/User';

import { useQuery } from '@tanstack/react-query';

export default function useUser(id: string) {
	return useQuery<User>({
		queryKey: ['users', id],
		queryFn: () => Batcher.user.get(id),
		retry: false,
	});
}
