import { Share2Icon } from 'lucide-react';

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
import ErrorMessage from '@/components/common/error-message';
import SizeCard from '@/components/common/size-card';
import ViewCount from '@/components/common/view-count';
import Tran from '@/components/common/tran';
import LikeAndDislike from '@/components/like/like-and-dislike';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getSession } from '@/action/common';
import { getCachedSchematic } from '@/action/query';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import ProtectedElement from '@/layout/protected-element';
import { isError } from '@/lib/error';

import dynamic from 'next/dynamic';

const DeleteSchematicButton = dynamic(() => import('@/components/schematic/delete-schematic.button'));
const TakeDownSchematicButton = dynamic(() => import('@/components/schematic/take-down-schematic.button'));

type SchematicDetailCardProps = {
	id: string;
	locale: Locale;
};

export default async function SchematicDetailCard({ id, locale }: SchematicDetailCardProps) {
	const schematic = await getCachedSchematic(id);
	const session = await getSession();

	if (isError(schematic)) {
		return <ErrorMessage error={schematic} />;
	}

	const {
		name,
		description,
                downloadCount,
                viewCount,
                likes,
		dislikes,
		userId,
		verifierId,
		width,
		height,
		createdAt,
		tags,
		itemId,
		metadata: { requirements },
		isVerified,
	} = schematic;

	const link = `${env.url.base}/${locale}/schematics/${id}`;
	const copyContent = <Tran text="copied-name" args={{ name }} />;
	const imageUrl = `${env.url.image}/schematics/${id}${env.imageFormat}`;
	const errorImageUrl = `${env.url.api}/schematics/${id}/image`;
	const downloadUrl = `${env.url.api}/schematics/${id}/download`;
	const downloadName = `{${name}}.msch`;

	return (
		<Detail>
			<CopyButton position="absolute" variant="ghost" data={link} content={link}>
				<Share2Icon />
			</CopyButton>
			<DetailContent>
				<DetailImage src={imageUrl} errorSrc={errorImageUrl} alt={name} />
				<DetailHeader>
					<DetailTitle className="border-b">{name}</DetailTitle>
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
						<CopyButton
							title={copyContent}
							data={{
								url: `/schematics/${id}/data`,
							}}
						/>
                                               <DownloadButton href={downloadUrl} fileName={downloadName} count={downloadCount} />
                                               <ViewCount count={viewCount} />
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
									authority: 'DELETE_SCHEMATIC',
								}}
							>
								<DeleteSchematicButton variant="command" id={id} name={name} />
							</ProtectedElement>
						</EllipsisButton>
					</DetailActions>
				</DetailHeader>
			</DetailContent>
		</Detail>
	);
}
