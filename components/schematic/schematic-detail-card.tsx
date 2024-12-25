'use client';

import { useParams } from 'next/navigation';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import CommentSection from '@/components/common/comment-section';
import { Detail, DetailActions, DetailContent, DetailDescription, DetailHeader, DetailImage, DetailInfo, DetailTagsCard, DetailTitle, Verifier } from '@/components/common/detail';
import { LinkIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import { DeleteSchematicButton } from '@/components/schematic/delete-schematic-button';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import { TakeDownSchematicButton } from '@/components/schematic/take-down-schematic-button';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import IdUserCard from '@/components/user/id-user-card';

import env from '@/constant/env';
import { useSession } from '@/context/session-context.client';
import useClientApi from '@/hooks/use-client';
import useToastAction from '@/hooks/use-toast-action';
import ProtectedElement from '@/layout/protected-element';
import { getSchematicData } from '@/query/schematic';
import { SchematicDetail } from '@/types/response/SchematicDetail';

type SchematicDetailCardProps = {
  schematic: SchematicDetail;
};

export default function SchematicDetailCard({ schematic: { id, name, description, tags, requirements, verifierId, itemId, likes, dislikes, userLike, userId, isVerified, width, height, downloadCount } }: SchematicDetailCardProps) {
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
      <DetailContent>
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
            <ItemRequirementCard requirements={requirements} />
            <DetailTagsCard tags={tags} />
          </DetailHeader>
        </DetailInfo>
        <DetailActions>
          <CopyButton title={copyContent} data={getData} />
          <DownloadButton href={downloadUrl} fileName={downloadName} count={downloadCount} />
          <LikeComponent itemId={itemId} initialLikeCount={likes} initialDislikeCount={dislikes} initialLikeData={userLike}>
            <LikeButton />
            <DislikeButton />
          </LikeComponent>
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
    </Detail>
  );
}
