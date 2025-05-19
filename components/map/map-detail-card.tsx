'use client';

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
import { Hidden } from '@/components/common/hidden';
import { ShareIcon } from '@/components/common/icons';
import JsonDisplay from '@/components/common/json-display';
import ScrollContainer from '@/components/common/scroll-container';
import SizeCard from '@/components/common/size-card';
import Tran from '@/components/common/tran';
import LikeAndDislike from '@/components/like/like-and-dislike';
import { DeleteMapButton } from '@/components/map/delete-map.button';
import { TakeDownMapButton } from '@/components/map/take-down-map.button';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import env from '@/constant/env';
import { useSession } from '@/context/session.context';
import ProtectedElement from '@/layout/protected-element';
import { getMaps } from '@/query/map';
import { MapDetail } from '@/types/response/MapDetail';
import { ItemPaginationQuery } from '@/types/schema/search-query';

type MapDetailCardProps = {
	map: MapDetail;
};

export default function MapDetailCard({
	map: {
		id,
		name,
		description,
		tags,
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
		meta,
	},
}: MapDetailCardProps) {
	const { session } = useSession();
	const { locale } = useParams();

	const link = `${env.url.base}/${locale}/maps/${id}`;
	const imageUrl = `${env.url.image}/maps/${id}${env.imageFormat}`;
	const errorImageUrl = `${env.url.api}/maps/${id}/image`;
	const downloadUrl = `${env.url.api}/maps/${id}/download`;
	const downloadName = `{${name}}.msch`;

	return (
		<Detail>
			<DetailSwipeToNavigate paramSchema={ItemPaginationQuery} queryKey={['maps']} queryFn={getMaps}>
				<CopyButton position="absolute" variant="ghost" data={link} content={link}>
					<ShareIcon />
				</CopyButton>
				<DetailContent>
					<DetailImage src={imageUrl} errorSrc={errorImageUrl} alt={name} />
					<DetailHeader>
						<DetailTitle>{name}</DetailTitle>
						<Tabs defaultValue="info" className="overflow-hidden flex flex-col">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="info">
									<Tran text="info" />
								</TabsTrigger>
								<TabsTrigger value="stats">
									<Tran text="stats" />
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
									<CreatedAt createdAt={createdAt} />
									<DetailDescription>{description}</DetailDescription>
									<DetailTagsCard tags={tags} type="map" />
								</DetailInfo>
							</TabsContent>
							<TabsContent value="stats">
								<ScrollContainer>
									<JsonDisplay json={meta} />
								</ScrollContainer>
							</TabsContent>
							<TabsContent value="comment">
								<CommentSection itemId={itemId} />
							</TabsContent>
						</Tabs>
						<DetailActions>
							<DownloadButton href={downloadUrl} fileName={downloadName} count={downloadCount} />
							<LikeAndDislike itemId={itemId} like={likes} dislike={dislikes} />
							<EllipsisButton>
								<ProtectedElement
									session={session}
									filter={{
										all: [
											{
												any: [{ authorId: userId }, { authority: 'DELETE_MAP' }],
											},
											isVerified,
										],
									}}
								>
									<TakeDownMapButton id={id} name={name} />
								</ProtectedElement>
								<ProtectedElement
									session={session}
									filter={{
										any: [{ authorId: userId }, { authority: 'DELETE_MAP' }],
									}}
								>
									<DeleteMapButton variant="command" id={id} name={name} />
								</ProtectedElement>
							</EllipsisButton>
						</DetailActions>
					</DetailHeader>
				</DetailContent>
			</DetailSwipeToNavigate>
		</Detail>
	);
}
