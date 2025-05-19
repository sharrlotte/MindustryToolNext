'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

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
	DetailTagsCard,
	DetailTitle,
	Verifier,
} from '@/components/common/detail';
import DetailSwipeToNavigate from '@/components/common/detail-swipe-to-navigate';
import { ShareIcon } from '@/components/common/icons';
import SizeCard from '@/components/common/size-card';
import Tran from '@/components/common/tran';
import LikeAndDislike from '@/components/like/like-and-dislike';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
		createdAt,
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
									<Verifier verifierId={verifierId} />
									<SizeCard size={{ width, height }} />
									<DetailDescription>{description}</DetailDescription>
									<CreatedAt createdAt={createdAt} />
									<ItemRequirementCard requirements={requirements} />
									<DetailTagsCard tags={tags} type="schematic" />
								</DetailInfo>
							</TabsContent>
							<TabsContent value="comment">
								<CommentSection itemId={itemId} />
							</TabsContent>
						</Tabs>
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
					</DetailHeader>
				</DetailContent>
			</DetailSwipeToNavigate>
		</Detail>
	);
}
