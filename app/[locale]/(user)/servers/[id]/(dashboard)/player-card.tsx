import ColorText from '@/components/common/color-text';
import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Skeleton } from '@/components/ui/skeleton';
import IdUserCard from '@/components/user/id-user-card';

import { serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getServerPlayers } from '@/query/server';
import { Player } from '@/types/response/Player';

type PlayersCardProps = {
  id: string;
};
export async function PlayersCard({ id }: PlayersCardProps) {
  const players = await serverApi((axios) => getServerPlayers(axios, id));

  if (isError(players)) {
    return <ErrorScreen error={players} />;
  }

  return (
    <div className="grid gap-1">
      {players
        .sort((a, b) => a.team.name.localeCompare(b.team.name))
        .map((player) => (
          <PlayerCard key={player.uuid} player={player} />
        ))}
    </div>
  );
}

type PlayersCardSkeletonProps = {
  players: number;
};
export function PlayersCardSkeleton({ players }: PlayersCardSkeletonProps) {
  if (players === 0) {
    return undefined;
  }

  return Array(players)
    .fill(1)
    .map((_, index) => <Skeleton className="h-10 w-24" key={index} />);
}

type PlayerCardProps = {
  player: Player;
};
async function PlayerCard({ player: { userId, name, team } }: PlayerCardProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex flex-col justify-between gap-1 px-4 py-1 hover:bg-secondary">
          <div className="flex justify-between gap-1">
            <ColorText className="text-lg font-semibold" text={name} />
            {userId && <IdUserCard id={userId} />}
          </div>
          <div className="border-b-2" style={{ borderColor: `#${team.color}` }} />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Tran text="player.info" />
        </ContextMenuItem>
        <ContextMenuItem variant="destructive">
          <Tran text="player.kick" />
        </ContextMenuItem>
        <ContextMenuItem variant="destructive">
          <Tran text="player.ban" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
