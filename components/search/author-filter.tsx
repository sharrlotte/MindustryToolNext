import { SearchIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import ErrorMessage from '@/components/common/error-message';
import { Hidden } from '@/components/common/hidden';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { SearchBar, SearchInput } from '@/components/search/search-input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ColorAsRole from '@/components/user/color-as-role';
import IdUserCard from '@/components/user/id-user-card';
import UserAvatar from '@/components/user/user-avatar';

import useClientApi from '@/hooks/use-client';
import { cn } from '@/lib/utils';
import { getUsers } from '@/query/user';

import { useQuery } from '@tanstack/react-query';

export default function AuthorFilter({
	authorId,
	handleAuthorChange,
}: {
	authorId: string | null;
	handleAuthorChange: (value: string | null) => void;
}) {
	const [name, setName] = useState('');
	const [debounced] = useDebounceValue(name, 200);
	const axios = useClientApi();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['users', name],
		queryFn: () =>
			getUsers(axios, {
				page: 0,
				size: 20,
				name: debounced,
			}),
	});

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return (
		<div className="flex gap-2 items-center">
			<Dialog>
				<DialogTrigger asChild>
					<div className="flex gap-2 items-center">
						<Tran className="text-base" text="author" defaultValue="Author" />
						<Button variant="outline">
							{authorId ? <IdUserCard id={authorId} /> : <Tran text="select" defaultValue="Select" />}
						</Button>
					</div>
				</DialogTrigger>
				{authorId && (
					<Button variant="outline" onClick={() => handleAuthorChange(null)}>
						<XIcon />
					</Button>
				)}
				<DialogContent className="p-6">
					<Hidden>
						<DialogTitle />
						<DialogDescription />
					</Hidden>
					<SearchBar className="mt-4">
						<SearchIcon />
						<SearchInput value={name} onChange={setName} />
					</SearchBar>
					{isLoading ? (
						<LoadingSpinner />
					) : (
						<ScrollContainer className="space-y-2 max-h-[50dvh]">
							{data?.map((user) => (
								<div
									className={cn('cursor-pointer p-2 rounded-md bg-secondary', {
										'bg-brand': user.id === authorId,
									})}
									key={user.id}
									onClick={() => handleAuthorChange(user.id === authorId ? null : user.id)}
								>
									<div className="flex overflow-hidden gap-2 items-end h-8 min-h-8">
										<UserAvatar user={user} />
										<ColorAsRole className="font-semibold capitalize" roles={user.roles}>
											{user.name}
										</ColorAsRole>
									</div>
								</div>
							))}
						</ScrollContainer>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
