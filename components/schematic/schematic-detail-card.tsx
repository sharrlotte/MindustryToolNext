'use client';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import { Detail, DetailActions, DetailDescription, DetailHeader, DetailImage, DetailInfo, DetailTagsCard, DetailTitle, Verifier } from '@/components/common/detail';
import DislikeButton from '@/components/like/dislike-button';
import LikeButton from '@/components/like/like-button';
import LikeComponent from '@/components/like/like-component';
import LikeCount from '@/components/like/like-count';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import IdUserCard from '@/components/user/id-user-card';
import env from '@/constant/env';
import { useSession } from '@/context/session-context.client';
import useClientApi from '@/hooks/use-client';
import useToastAction from '@/hooks/use-toast-action';
import ProtectedElement from '@/layout/protected-element';
import { useI18n } from '@/i18n/client';
import { SchematicDetail } from '@/types/response/SchematicDetail';

import { LinkIcon } from '@/components/common/icons';
import { DeleteSchematicButton } from '@/components/schematic/delete-schematic-button';
import { TakeDownSchematicButton } from '@/components/schematic/take-down-schematic-button';
import { getSchematicData } from '@/query/schematic';

type SchematicDetailCardProps = {
  schematic: SchematicDetail;
};

export default function SchematicDetailCard({
  schematic: { id, name, description, tags, requirements, verifierId, itemId, likes, userLike, userId, isVerified, width, height },
}: SchematicDetailCardProps) {
  const axios = useClientApi();
  const { session } = useSession();

  const t = useI18n();

  const getData = useToastAction({
    title: t('copying'),
    content: t('downloading-data'),
    action: async () => await getSchematicData(axios, id),
  });

  const link = `${env.url.base}/schematics/${id}`;
  const copyContent = t('copied-name', { name: name });
  const imageUrl = `${env.url.image}/schematics/${id}${env.imageFormat}`;
  const errorImageUrl = `${env.url.api}/schematics/${id}/image`;
  const downloadUrl = `${env.url.api}/schematics/${id}/download`;
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
            {width}x{height}
          </span>
          <DetailDescription>{description}</DetailDescription>
          <ItemRequirementCard requirements={requirements} />
          <DetailTagsCard tags={tags} />
        </DetailHeader>
      </DetailInfo>
      <DetailActions>
        <CopyButton content={copyContent} data={getData} />
        <DownloadButton href={downloadUrl} fileName={downloadName} />
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
    </Detail>
  );
}
