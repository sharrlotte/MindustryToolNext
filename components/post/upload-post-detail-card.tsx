'use client';

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
import { TagGroup, TagGroups } from '@/types/response/TagGroup';

import { useMutation } from '@tanstack/react-query';



import { useRouter } from 'next/navigation';


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
			invalidateByKey(['posts']);
			back();
		},
		onError: (error) => {
			toast.error(<Tran text="verify-fail" />, { error });
		},
	});

	const { mutate: deletePostById, isPending: isDeleting } = useMutation({
		mutationFn: (id: string) => deletePost(axios, id),
		onSuccess: () => {
			back();
			toast.success(<Tran text="delete-success" />);
		},
		onError: (error) => {
			toast.error(<Tran text="delete-fail" />, { error });
		},
		onSettled: () => {
			invalidateByKey(['posts']);
		},
	});

	const isLoading = isVerifying || isDeleting;

	return (
		<Detail className="p-2">
			<DetailContent>
				<div className="grid gap-2 pb-10 min-h-[100dvh]">
					<h2 className="text-4xl">{title}</h2>
					<div className="grid gap-2">
						<IdUserCard id={userId} />
						<span>{new Date(createdAt).toLocaleString()}</span>
						<TagContainer tagGroups={selectedTags} />
					</div>
					<div>
						<Markdown>{content}</Markdown>
					</div>
				</div>
				<footer className="flex justify-start gap-1 rounded-md bg-card p-2 mt-auto">
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
