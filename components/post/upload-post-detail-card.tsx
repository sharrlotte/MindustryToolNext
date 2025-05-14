'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import DeleteButton from '@/components/button/delete.button';
import VerifyButton from '@/components/button/verify.button';
import { Detail, DetailContent } from '@/components/common/detail';
import Tran from '@/components/common/tran';
import Markdown from '@/components/markdown/markdown';
import TagSelector from '@/components/search/tag-selector';
import TagContainer from '@/components/tag/tag-container';
import BackButton from '@/components/ui/back-button';
import { toast } from '@/components/ui/sonner';
import IdUserCard from '@/components/user/id-user-card';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deletePost, verifyPost } from '@/query/post';
import VerifyPostRequest from '@/types/request/VerifyPostRequest';
import { PostDetail } from '@/types/response/PostDetail';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

import { useMutation } from '@tanstack/react-query';

type UploadPostDetailCardProps = {
	post: PostDetail;
};

export default function UploadPostDetailCard({ post }: UploadPostDetailCardProps) {
	const { id, title, userId, content, createdAt, tags } = post;

	const { back } = useRouter();
	const axios = useClientApi();

	const [selectedTags, setSelectedTags] = useState<TagGroup[]>(TagGroups.parsTagDto(tags));
	const { invalidateByKey } = useQueriesData();

	const { mutate: verifyPostById, isPending: isVerifying } = useMutation({
		mutationFn: (data: VerifyPostRequest) => verifyPost(axios, data),
		onSuccess: () => {
			back();
		},
		onError: (error) => {
			toast(<Tran text="verify-fail" />, { description: error?.message });
		},
		onSettled: () => {
			invalidateByKey(['posts']);
		},
	});

	const { mutate: deletePostById, isPending: isDeleting } = useMutation({
		mutationFn: (id: string) => deletePost(axios, id),
		onSuccess: () => {
			back();
			toast.success(<Tran text="delete-success" />);
		},
		onError: (error) => {
			toast.error(<Tran text="delete-fail" />, { description: error?.message });
		},
		onSettled: () => {
			invalidateByKey(['posts']);
		},
	});

	const isLoading = isVerifying || isDeleting;

	return (
		<Detail>
			<DetailContent>
				<header className="grid gap-2 pb-10">
					<p className="text-4xl">{title}</p>
					<div className="grid gap-2">
						<IdUserCard id={userId} />
						<span>{new Date(createdAt).toLocaleString()}</span>
						<TagContainer tagGroups={selectedTags} />
					</div>
					<div>
						<Markdown>{content}</Markdown>
					</div>
				</header>
				<footer className="flex justify-start gap-1 rounded-md bg-card p-2">
					<TagSelector type="post" value={selectedTags} onChange={setSelectedTags} hideSelectedTag />
					<DeleteButton
						variant="default"
						className="w-fit"
						description={<Tran text="delete-alert" args={{ name: title }} />}
						isLoading={isLoading}
						onClick={() => deletePostById(id)}
					/>
					<VerifyButton
						description={<Tran text="verify-alert" args={{ name: title }} />}
						isLoading={isLoading}
						onClick={() =>
							verifyPostById({
								id,
								tags: TagGroups.toStringArray(selectedTags),
							})
						}
					/>
					<BackButton className="ml-auto" />
				</footer>
			</DetailContent>
		</Detail>
	);
}
