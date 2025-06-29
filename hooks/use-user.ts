import { User } from '@/query/user';

import { Batcher } from '@/lib/batcher';

import { useQuery } from '@tanstack/react-query';

export default function useUser(id: string) {
	return useQuery<User>({
		queryKey: ['users', id],
		queryFn: () => Batcher.user.get(id),
		retry: false,
	});
}
