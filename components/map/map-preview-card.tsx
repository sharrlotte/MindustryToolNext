'use client';

import { Share2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

import CopyButton from '@/components/button/copy.button';
import DownloadButton from '@/components/button/download.button';
import ColorText from '@/components/common/color-text';
import InternalLink from '@/components/common/internal-link';
import { Preview, PreviewActions, PreviewDescription, PreviewHeader, PreviewImage } from '@/components/common/preview';
import ViewCount from '@/components/common/view-count';
import LikeAndDislike from '@/components/like/like-and-dislike';

import env from '@/constant/env';
import { Map } from '@/types/response/Map';

type MapPreviewCardProps = {
	map: Map;
};

function MapPreviewCard({ map: { id, name, likes, dislikes, downloadCount, itemId, viewCount } }: MapPreviewCardProps) {
	const { locale } = useParams();

	const link = `${env.url.base}/${locale}/maps/${id}`;
	const detailLink = `/maps/${id}`;
	const imageLink = `${env.url.image}/map-previews/${id}${env.imageFormat}`;
	const errorImageLink = `${env.url.api}/maps/${id}/image`;
	const downloadLink = `${env.url.api}/maps/${id}/download`;
	const downloadName = `{${name}}.msav`;

	return (
		<Preview>
			<CopyButton position="absolute" variant="ghost" data={link} content={link}>
				<Share2Icon />
			</CopyButton>
			<InternalLink href={detailLink} prefetch={false}>
				<PreviewImage src={imageLink} errorSrc={errorImageLink} alt={name} />
			</InternalLink>
			<PreviewDescription>
				<PreviewHeader>
					<ColorText className="line-clamp-1" text={name} />
				</PreviewHeader>
				<PreviewActions>
					<LikeAndDislike itemId={itemId} like={likes} dislike={dislikes} />
                                        <DownloadButton count={downloadCount} href={downloadLink} fileName={downloadName} />
                                        <ViewCount count={viewCount} />
                                </PreviewActions>
			</PreviewDescription>
		</Preview>
	);
}

export default MapPreviewCard;
