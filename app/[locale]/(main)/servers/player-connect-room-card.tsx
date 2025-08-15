import { Clock, Gamepad2, Map, Shield, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { PlayerConnectRoom } from '@/types/response/PlayerConnectRoom';

export default function PlayerConnectRoomCard({ data: room }: { data: PlayerConnectRoom }) {
	const { data } = room;
	const createdDate = new Date(data.createdAt).toLocaleDateString();

	return (
		<Card className="bg-black border transition-colors">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-white text-lg font-semibold truncate">{data.name}</CardTitle>
					{data.isSecured === 'true' && <Shield className="h-4 w-4 text-white/70" />}
				</div>
				<div className="flex items-center gap-2 text-sm text-white/70">
					<Users className="h-4 w-4" />
					<span>{data.players.length} players</span>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div className="flex items-center gap-2">
						<Map className="h-4 w-4 text-white/70" />
						<span className="text-white/90 truncate">{data.mapName}</span>
					</div>
					<div className="flex items-center gap-2">
						<Gamepad2 className="h-4 w-4 text-white/70" />
						<span className="text-white/90 truncate">{data.gamemode}</span>
					</div>
				</div>

				<div className="space-y-2">
					<div className="text-xs text-white/70">Version: {data.version}</div>
					<div className="text-xs text-white/70">Locale: {data.locale}</div>
					<div className="flex items-center gap-1 text-xs text-white/70">
						<Clock className="h-3 w-3" />
						<span>Created: {createdDate}</span>
					</div>
				</div>

				{data.mods.length > 0 && (
					<div className="space-y-2">
						<div className="text-xs text-white/70">Mods:</div>
						<div className="flex flex-wrap gap-1">
							{data.mods.slice(0, 3).map((mod, index) => (
								<Badge key={index} variant="secondary" className="bg-black/50 text-white/90 border-black/30 text-xs">
									{mod}
								</Badge>
							))}
							{data.mods.length > 3 && (
								<Badge variant="secondary" className="bg-black/50 text-white/70 border-black/30 text-xs">
									+{data.mods.length - 3} more
								</Badge>
							)}
						</div>
					</div>
				)}

				{data.players.length > 0 && (
					<div className="space-y-2">
						<div className="text-xs text-white/70">Players:</div>
						<div className="space-y-1 max-h-20 overflow-y-auto">
							{data.players.map((player, index) => (
								<div key={index} className="flex justify-between text-xs">
									<span className="text-white/90 truncate">{player.name}</span>
									<span className="text-white/60 ml-2">{player.locale}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
