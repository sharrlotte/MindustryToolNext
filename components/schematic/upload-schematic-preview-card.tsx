import { Share2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

import CopyButton from '@/components/button/copy.button';
import DownloadButton from '@/components/button/download.button';
import { BulkActionSelector } from '@/components/common/bulk-action';
import ColorText from '@/components/common/color-text';
import InternalLink from '@/components/common/internal-link';
import { Preview, PreviewActions, PreviewDescription, PreviewHeader, PreviewImage } from '@/components/common/preview';
import Tran from '@/components/common/tran';
import DeleteSchematicButton from '@/components/schematic/delete-schematic.button';

import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useToastAction from '@/hooks/use-toast-action';
import { getSchematicData } from '@/query/schematic';
import { Schematic } from '@/types/response/Schematic';

type UploadSchematicPreviewCardProps = {
	schematic: Schematic;
};

function UploadSchematicPreviewCard({ schematic: { id, name } }: UploadSchematicPreviewCardProps) {
	const axios = useClientApi();
	const { locale } = useParams();

	const link = `${env.url.base}/${locale}/admin/schematics/${id}`;
	const detailLink = `/admin/schematics/${id}`;
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
			<BulkActionSelector value={id}>
				<InternalLink className="flex" href={detailLink} prefetch={false}>
					<PreviewImage src={imageLink} errorSrc={errorImageLink} alt={name} />
				</InternalLink>
				<PreviewDescription>
					<PreviewHeader>
						<ColorText text={name} />
					</PreviewHeader>
					<PreviewActions>
						<CopyButton content={copyContent} data={getData} />
						<DownloadButton href={downloadLink} fileName={downloadName} />
						<DeleteSchematicButton id={id} name={name} />
					</PreviewActions>
				</PreviewDescription>
			</BulkActionSelector>
		</Preview>
	);
}

export default UploadSchematicPreviewCard;
