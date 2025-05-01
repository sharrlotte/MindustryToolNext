'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import CopyButton from '@/components/button/copy.button';
import DownloadButton from '@/components/button/download.button';
import CommentSection from '@/components/common/comment-section';
import {
	Detail,
	DetailActions,
	DetailContent,
	DetailDescription,
	DetailHeader,
	DetailImage,
	DetailInfo,
	DetailTagsCard,
	DetailTitle,
	Verifier,
} from '@/components/common/detail';
import DetailSwipeToNavigate from '@/components/common/detail-swipe-to-navigate';
import { ShareIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import LikeAndDislike from '@/components/like/like-and-dislike';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import IdUserCard from '@/components/user/id-user-card';

import env from '@/constant/env';
import { useSession } from '@/context/session.context';
import useClientApi from '@/hooks/use-client';
import useToastAction from '@/hooks/use-toast-action';
import ProtectedElement from '@/layout/protected-element';
import { getSchematicData, getSchematics } from '@/query/schematic';
import { SchematicDetail } from '@/types/response/SchematicDetail';
import { ItemPaginationQuery } from '@/types/schema/search-query';

const DeleteSchematicButton = dynamic(() => import('@/components/schematic/delete-schematic.button'));
const TakeDownSchematicButton = dynamic(() => import('@/components/schematic/take-down-schematic.button'));

type SchematicDetailCardProps = {
	schematic: SchematicDetail;
};

export default function SchematicDetailCard({
	schematic: {
		id,
		name,
		description,
		tags,
		metadata: { requirements },
		verifierId,
		itemId,
		likes,
		dislikes,
		userId,
		isVerified,
		width,
		height,
		downloadCount,
	},
}: SchematicDetailCardProps) {
	const axios = useClientApi();
	const { session } = useSession();

	const getData = useToastAction({
		title: <Tran text="copying" />,
		content: <Tran text="downloading-data" />,
		action: async () => await getSchematicData(axios, id),
	});
	const { locale } = useParams();

	const link = `${env.url.base}/${locale}/schematics/${id}`;
	const copyContent = <Tran text="copied-name" args={{ name }} />;
	const imageUrl = `${env.url.image}/schematics/${id}${env.imageFormat}`;
	const errorImageUrl = `${env.url.api}/schematics/${id}/image`;
	const downloadUrl = `${env.url.api}/schematics/${id}/download`;
	const downloadName = `{${name}}.msch`;

	return (
		<Detail>
			<DetailSwipeToNavigate paramSchema={ItemPaginationQuery} queryKey={['schematics']} queryFn={getSchematics}>
				<DetailContent>
					<DetailInfo>
						<DetailImage src={imageUrl} errorSrc={errorImageUrl} alt={name} />
						<CopyButton position="absolute" variant="ghost" data={link} content={link}>
							<ShareIcon />
						</CopyButton>
						<DetailHeader>
							<DetailTitle>{name}</DetailTitle>
							<IdUserCard id={userId} />
							<Verifier verifierId={verifierId} />
							<span>
								<Tran text="size" /> {width}x{height}
							</span>
							<DetailDescription>{description}</DetailDescription>
							<ItemRequirementCard requirements={requirements} />
							<DetailTagsCard tags={tags} type="schematic" />
						</DetailHeader>
					</DetailInfo>
					<DetailActions>
						<CopyButton title={copyContent} data={getData} />
						<DownloadButton href={downloadUrl} fileName={downloadName} count={downloadCount} />
						<LikeAndDislike itemId={itemId} like={likes} dislike={dislikes} />
						<EllipsisButton>
							<ProtectedElement
								session={session}
								filter={{
									all: [
										{
											any: [{ authorId: userId }, { authority: 'DELETE_SCHEMATIC' }],
										},
										isVerified,
									],
								}}
							>
								<TakeDownSchematicButton id={id} name={name} />
							</ProtectedElement>
							<ProtectedElement
								session={session}
								filter={{
									any: [{ authorId: userId }, { authority: 'DELETE_SCHEMATIC' }],
								}}
							>
								<DeleteSchematicButton variant="command" id={id} name={name} />
							</ProtectedElement>
						</EllipsisButton>
					</DetailActions>
				</DetailContent>
				<CommentSection itemId={itemId} />
			</DetailSwipeToNavigate>
		</Detail>
	);
}
