'use client';

import { Share2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

import CopyButton from '@/components/button/copy.button';
import DownloadButton from '@/components/button/download.button';
import ColorText from '@/components/common/color-text';
import InternalLink from '@/components/common/internal-link';
import { Preview, PreviewActions, PreviewDescription, PreviewHeader, PreviewImage } from '@/components/common/preview';
import Tran from '@/components/common/tran';
import LikeAndDislike from '@/components/like/like-and-dislike';

import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useToastAction from '@/hooks/use-toast-action';
import { getSchematicData } from '@/query/schematic';
import { Schematic } from '@/types/response/Schematic';

type SchematicPreviewCardProps = {
	schematic: Schematic;
};

export default function SchematicPreviewCard({
	schematic: { id, name, likes, dislikes, downloadCount, itemId },
}: SchematicPreviewCardProps) {
	const axios = useClientApi();
	const { locale } = useParams();

	const link = `${env.url.base}/${locale}/schematics/${id}`;
	const detailLink = `/schematics/${id}`;
	const imageLink = `${env.url.image}/schematic-previews/${id}${env.imageFormat}`;
	const errorImageLink = `${env.url.api}/schematics/${id}/image`;
	const copyContent = `Copied schematic ${name}`;
	const downloadLink = `${env.url.api}/schematics/${id}/download`;
	const downloadName = `{${name}}.msch`;

	const getData = useToastAction({
		title: <Tran text="copying" />,
		content: <Tran text="downloading-data" />,
		action: async () => await getSchematicData(axios, id),
	});

	return (
		<Preview>
			<CopyButton position="absolute" variant="ghost" data={link} content={link}>
				<Share2Icon />
			</CopyButton>
			<InternalLink href={detailLink}>
				<PreviewImage src={imageLink} errorSrc={errorImageLink} alt={name} />
			</InternalLink>
			<PreviewDescription>
				<PreviewHeader>
					<ColorText className="line-clamp-1" text={name} />
				</PreviewHeader>
				<PreviewActions>
					<LikeAndDislike like={likes} dislike={dislikes} itemId={itemId} />
					<CopyButton content={copyContent} data={getData} />
					<DownloadButton count={downloadCount} href={downloadLink} fileName={downloadName} />
				</PreviewActions>
			</PreviewDescription>
		</Preview>
	);
}
