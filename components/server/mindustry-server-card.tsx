import CopyButton from '@/components/button/copy-button';
import ColorText from '@/components/common/color-text';
import LikeComponent from '@/components/like/like-component';
import MindustryServer from '@/types/response/MindustryServer';
import React from 'react';

type MindustryServerCardProps = {
  server: MindustryServer;
};

export default function MindustryServerCard({
  server,
}: MindustryServerCardProps) {
  return (
    <div className="flex flex-col gap-2 overflow-hidden rounded-md bg-card p-2">
      <CopyButton
        className="justify-start px-0 text-xl"
        title="Copied"
        content={server.address}
        data={server.address}
        variant="ghost"
      >
        <ColorText
          className="overflow-hidden whitespace-nowrap"
          text={server.name ? server.name : server.address}
        />
      </CopyButton>
      <section className="flex h-full flex-col overflow-hidden rounded-sm bg-background p-2">
        <div className="flex h-full flex-col justify-between">
          <div className="grid grid-cols-1 gap-x-2 md:grid-cols-2">
            <div className="flex gap-2">
              <span>{server.players}</span>
              {server.playerLimit ? (
                <>
                  <span>/</span>
                  <span>{server.playerLimit}</span>
                </>
              ) : (
                ''
              )}
              players
            </div>
            <span className="flex flex-row gap-2">Wave: {server.wave}</span>
            <span className="flex flex-row gap-2">
              Map: <ColorText text={server.mapname} />
            </span>
            <span className="capitalize">
              Version:
              {server.version === -1 ? server.versionType : server.version}
            </span>
            <span>
              Status:
              {server.online ? 'Online' : 'Offline'}
            </span>
            <span className="overflow-hidden whitespace-nowrap capitalize">
              Game mode:
              {server.modeName ? server.mapname : server.mode}
            </span>
          </div>
          <span className="col-span-full">
            Address:
            {server.address}
          </span>
          {server.description && (
            <div className="col-span-full">
              Description: <ColorText text={server.description} />
            </div>
          )}
          <span>Ping: {server.ping}ms</span>
          <div className="flex justify-end gap-2">
            <LikeComponent
              initialLikeCount={server.like}
              initialLikeData={server.userLike}
              targetType={'SERVERS'}
              targetId={server.id}
            >
              <LikeComponent.LikeButton />
              <LikeComponent.LikeCount />
              <LikeComponent.DislikeButton />
            </LikeComponent>
          </div>
        </div>
      </section>
    </div>
  );
}
