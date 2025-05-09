'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

import CopyButton from '@/components/button/copy.button';
import DownloadButton from '@/components/button/download.button';
import CreatedAt from '@/components/common/created-at';
import {
	Detail,
	DetailActions,
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
import IdUserCard from '@/components/user/id-user-card';

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
			<DetailContent>
				<DetailInfo>
					<CopyButton position="absolute" variant="ghost" data={link} content={link}>
						<ShareIcon />
					</CopyButton>
					<DetailImage src={imageUrl} errorSrc={errorImageUrl} alt={name} />
					<DetailHeader>
						<DetailTitle>{name}</DetailTitle>
						<IdUserCard id={userId} />
						<SizeCard size={{ width, height }} />
						<DetailDescription>{description}</DetailDescription>
						<ItemRequirementCard requirements={requirements} />
						<CreatedAt createdAt={createdAt} />
						<TagSelector type="schematic" value={selectedTags} onChange={setSelectedTags} />
					</DetailHeader>
				</DetailInfo>
				<DetailActions>
					<CopyButton content={copyMessage} data={getData} />
					<DownloadButton href={downloadUrl} fileName={downloadName} />
					<DeleteSchematicButton id={id} name={name} />
					<VerifySchematicButton id={id} name={name} selectedTags={selectedTags} />
				</DetailActions>
			</DetailContent>
		</Detail>
	);
}
