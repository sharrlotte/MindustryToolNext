'use client';

import { useParams } from 'next/navigation';

import CopyButton from '@/components/button/copy.button';
import DownloadButton from '@/components/button/download.button';
import CommentSection from '@/components/common/comment-section';
import { Detail, DetailActions, DetailContent, DetailDescription, DetailHeader, DetailImage, DetailInfo, DetailTagsCard, DetailTitle, Verifier } from '@/components/common/detail';
import { ShareIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import LikeAndDislike from '@/components/like/like-and-dislike';
import { DeleteMapButton } from '@/components/map/delete-map.button';
import { TakeDownMapButton } from '@/components/map/take-down-map.button';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import IdUserCard from '@/components/user/id-user-card';

import env from '@/constant/env';
import { useSession } from '@/context/session.context';
import ProtectedElement from '@/layout/protected-element';
import { MapDetail } from '@/types/response/MapDetail';

type MapDetailCardProps = {
	map: MapDetail;
};

export default function MapDetailCard({ map: { id, name, description, tags, verifierId, itemId, likes, dislikes, userId, isVerified, width, height, downloadCount } }: MapDetailCardProps) {
	const { session } = useSession();
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
						<DetailTagsCard tags={tags} type="map" />
					</DetailHeader>
				</DetailInfo>
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
			</DetailContent>
			<CommentSection itemId={itemId} />
		</Detail>
	);
}
