'use client';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import CommentSection from '@/components/common/comment-section';
import { Detail, DetailActions, DetailDescription, DetailHeader, DetailImage, DetailInfo, DetailTagsCard, DetailTitle, Verifier } from '@/components/common/detail';
import { LinkIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import LikeCount from '@/components/like/like-count';
import { DeleteMapButton } from '@/components/map/delete-map-button';
import { TakeDownMapButton } from '@/components/map/take-down-map-button';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import IdUserCard from '@/components/user/id-user-card';

import env from '@/constant/env';
import { useSession } from '@/context/session-context.client';
import ProtectedElement from '@/layout/protected-element';
import { MapDetail } from '@/types/response/MapDetail';

type MapDetailCardProps = {
  map: MapDetail;
};

export default function MapDetailCard({ map: { id, name, description, tags, verifierId, itemId, likes, userLike, userId, isVerified, width, height, downloadCount } }: MapDetailCardProps) {
  const { session } = useSession();

  const link = `${env.url.base}/maps/${id}`;
  const imageUrl = `${env.url.image}/maps/${id}${env.imageFormat}`;
  const errorImageUrl = `${env.url.api}/maps/${id}/image`;
  const downloadUrl = `${env.url.api}/maps/${id}/download`;
  const downloadName = `{${name}}.msch`;

  return (
    <Detail>
      <DetailInfo>
        <DetailImage src={imageUrl} errorSrc={errorImageUrl} alt={name} />
        <CopyButton position="absolute" variant="ghost" data={link} content={link}>
          <LinkIcon />
        </CopyButton>
        <DetailHeader>
          <DetailTitle>{name}</DetailTitle>
          <IdUserCard id={userId} />
          <Verifier verifierId={verifierId} />
          <span>
            <Tran text="size" /> {width}x{height}
          </span>
          <DetailDescription>{description}</DetailDescription>
          <DetailTagsCard tags={tags} />
        </DetailHeader>
      </DetailInfo>
      <DetailActions>
        <DownloadButton href={downloadUrl} fileName={downloadName} count={downloadCount} />
        <LikeComponent itemId={itemId} initialLikeCount={likes} initialLikeData={userLike}>
          <LikeButton />
          <LikeCount />
          <DislikeButton />
        </LikeComponent>
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
      <CommentSection itemId={itemId} />
    </Detail>
  );
}
