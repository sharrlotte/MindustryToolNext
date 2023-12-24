import Detail from '@/components/detail/detail';
import LikeComponent from '@/components/like/like-component';
import TagCard from '@/components/tag/tag-card';
import BackButton from '@/components/ui/back-button';
import CopyButton from '@/components/ui/copy-button';
import env from '@/constant/env';
import Map from '@/types/response/Map';
import { Tags } from '@/types/data/Tag';
import React, { HTMLAttributes } from 'react';
import DownloadButton from '@/components/ui/download-button';
import IdUserCard from '@/components/user/id-user-card';

type MapDetailProps = HTMLAttributes<HTMLDivElement> & {
  map: Map;
};

export default function MapDetail({ map }: MapDetailProps) {
  const tags = Tags.parseStringArray(map.tags);
  const link = `${env.url.base}/maps/${map.id}`;

  return (
    <Detail>
      <Detail.Info>
        <div className="relative">
          <CopyButton
            className="absolute left-1 top-1 "
            title="Copy"
            variant="ghost"
            data={link}
            content={link}
          />
          <Detail.Image
            src={`${env.url.image}/maps/${map.id}.png`}
            errorSrc={`${env.url.api}/maps/${map.id}/image`}
            alt={map.name}
          />
        </div>
        <Detail.Description>
          <Detail.Header>{map.name}</Detail.Header>
          <IdUserCard id={map.authorId} />
          <p>{map.description}</p>
          <section className="flex flex-wrap gap-1">
            {tags.map((item, index) => (
              <TagCard key={index} tag={item} />
            ))}
          </section>
        </Detail.Description>
      </Detail.Info>
      <Detail.Actions className="flex justify-between">
        <div className="flex gap-1">
          <DownloadButton
            className="aspect-square"
            href={`${env.url.api}/maps/${map.id}/download`}
          />
          <LikeComponent
            initialLikeCount={map.like}
            initialLikeData={map.userLike}
          >
            <LikeComponent.LikeButton
              className="aspect-square"
              size="icon"
              variant="outline"
              title="Like"
            />
            <LikeComponent.LikeCount
              className="aspect-square text-xl"
              size="icon"
              variant="outline"
              title="Like count"
            />
            <LikeComponent.DislikeButton
              className="aspect-square"
              size="icon"
              variant="outline"
              title="Dislike"
            />
          </LikeComponent>
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
