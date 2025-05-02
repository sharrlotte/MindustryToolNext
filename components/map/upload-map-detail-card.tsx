'use client';

import { useParams } from 'next/navigation';
import React, { useState } from 'react';

import CopyButton from '@/components/button/copy.button';
import DownloadButton from '@/components/button/download.button';
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
import { DeleteMapButton } from '@/components/map/delete-map.button';
import VerifyMapButton from '@/components/map/verify-map.button';
import TagSelector from '@/components/search/tag-selector';
import IdUserCard from '@/components/user/id-user-card';

import env from '@/constant/env';
import { MapDetail } from '@/types/response/MapDetail';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';
import SizeCard from '@/components/common/size-card';

type UploadMapDetailCardProps = {
	map: MapDetail;
};

export default function UploadMapDetailCard({
	map: { id, name, tags, description, userId, width, height },
}: UploadMapDetailCardProps) {
	const [selectedTags, setSelectedTags] = useState<TagGroup[]>(TagGroups.parsTagDto(tags));

	const { locale } = useParams();

	const link = `${env.url.base}/${locale}/maps/${id}`;
	const imageUrl = `${env.url.image}/maps/${id}${env.imageFormat}`;
	const errorImageUrl = `${env.url.api}/maps/${id}/image`;
	const downloadUrl = `${env.url.api}/maps/${id}/download`;
	const downloadName = `{${name}}.msch`;

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
						<TagSelector type="map" value={selectedTags} onChange={setSelectedTags} />
					</DetailHeader>
				</DetailInfo>
				<DetailActions>
					<DownloadButton href={downloadUrl} fileName={downloadName} />
					<DeleteMapButton id={id} name={name} />
					<VerifyMapButton id={id} name={name} selectedTags={selectedTags} />
				</DetailActions>
			</DetailContent>
		</Detail>
	);
}
