'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

import CopyButton from '@/components/button/copy.button';
import DownloadButton from '@/components/button/download.button';
import CommentSection from '@/components/common/comment-section';
import CreatedAt from '@/components/common/created-at';
import {
	Detail,
	DetailActions,
	DetailAuthor,
	DetailContent,
	DetailDescription,
	DetailHeader,
	DetailImage,
	DetailInfo,
	DetailTitle,
} from '@/components/common/detail';
import { ShareIcon } from '@/components/common/icons';
import SizeCard from '@/components/common/size-card';
import Tran from '@/components/common/tran';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import VerifySchematicButton from '@/components/schematic/verify-schematic.button';
import TagSelector from '@/components/search/tag-selector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useToastAction from '@/hooks/use-toast-action';
import { getSchematicData } from '@/query/schematic';
import { SchematicDetail } from '@/types/response/SchematicDetail';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

const DeleteSchematicButton = dynamic(() => import('@/components/schematic/delete-schematic.button'));

type UploadSchematicDetailCardProps = {
	schematic: SchematicDetail;
};

export default function UploadSchematicDetailCard({
	schematic: {
		id,
		name,
		tags,
		metadata: { requirements },
		description,
		userId,
		width,
		height,
		createdAt,
		itemId,
	},
}: UploadSchematicDetailCardProps) {
	const axios = useClientApi();

	const [selectedTags, setSelectedTags] = useState<TagGroup[]>(TagGroups.parsTagDto(tags));

	const { locale } = useParams();

	const link = `${env.url.base}/${locale}/schematics/${id}`;
	const imageUrl = `${env.url.image}/schematics/${id}${env.imageFormat}`;
	const errorImageUrl = `${env.url.api}/schematics/${id}/image`;
	const copyMessage = `Copied schematic ${name}`;
	const downloadUrl = `${env.url.api}/schematics/${id}/download`;
	const downloadName = `{${name}}.msch`;

	const getData = useToastAction({
		title: <Tran text="copying" />,
		content: <Tran text="downloading-data" />,
		action: async () => await getSchematicData(axios, id),
	});

	return (
		<Detail>
			<CopyButton position="absolute" variant="ghost" data={link} content={link}>
				<ShareIcon />
			</CopyButton>
			<DetailContent>
				<DetailImage src={imageUrl} errorSrc={errorImageUrl} alt={name} />
				<DetailHeader>
					<DetailTitle>{name}</DetailTitle>
					<Tabs defaultValue="info" className="overflow-hidden flex flex-col">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="info">
								<Tran text="info" />
							</TabsTrigger>
							<TabsTrigger value="comment">
								<Tran text="comment" />
							</TabsTrigger>
						</TabsList>
						<TabsContent value="info">
							<DetailInfo>
								<DetailAuthor authorId={userId} />
								<SizeCard size={{ width, height }} />
								<DetailDescription>{description}</DetailDescription>
								<CreatedAt createdAt={createdAt} />
								<ItemRequirementCard requirements={requirements} />
								<TagSelector type="schematic" value={selectedTags} onChange={setSelectedTags} />
							</DetailInfo>
						</TabsContent>
						<TabsContent value="comment">
							<CommentSection itemId={itemId} />
						</TabsContent>
					</Tabs>
					<DetailActions>
						<CopyButton content={copyMessage} data={getData} />
						<DownloadButton href={downloadUrl} fileName={downloadName} />
						<DeleteSchematicButton id={id} name={name} goBack />
						<VerifySchematicButton id={id} name={name} selectedTags={selectedTags} />
					</DetailActions>
				</DetailHeader>
			</DetailContent>
		</Detail>
	);
}
