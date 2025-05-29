'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

import ColorText from '@/components/common/color-text';
import ErrorMessage from '@/components/common/error-message';
import Tran from '@/components/common/tran';
import { BanButton } from '@/components/server/ban.button';
import { KickButton } from '@/components/server/kick.button';
import Divider from '@/components/ui/divider';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { Skeleton } from '@/components/ui/skeleton';
import Skeletons from '@/components/ui/skeletons';
import IdUserCard from '@/components/user/id-user-card';

import useClientApi from '@/hooks/use-client';
import { getServerPlayers } from '@/query/server';
import { Player } from '@/types/response/Player';

import { useQuery } from '@tanstack/react-query';

type PlayerListProps = {
	id: string;
	players: number;
};

export default function PlayerList({ id, players }: PlayerListProps) {
	const axios = useClientApi();
	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['server', id, 'player'],
		queryFn: () => getServerPlayers(axios, id),
		refetchInterval: 30000,
	});

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	if (isLoading) {
		return (
			<Skeletons number={players}>
				<Skeleton className="w-full h-11 rounded-md" />
			</Skeletons>
		);
	}

	return (
		<>
			<h3 className="font-semibold">
				<Tran text="server.player-list" />
			</h3>
			<Divider />
			<AnimatePresence>
				{data
					?.sort((a, b) => a.name.localeCompare(b.name))
					?.sort((a, b) => (a.locale ?? 'EN').localeCompare(b.locale ?? 'EN'))
					?.sort((a, b) => a.team.name.localeCompare(b.team.name))
					.map((player) => <PlayerCard key={player.uuid} serverId={id} player={player} />)}
			</AnimatePresence>
		</>
	);
}

type PlayerListSkeletonProps = {
	players: number;
};

export function PlayerListSkeleton({ players }: PlayerListSkeletonProps) {
	if (players === 0) {
		return undefined;
	}

	return Array(players)
		.fill(1)
		.map((_, index) => <Skeleton className="w-full h-10" key={index} />);
}

type PlayerCardProps = {
	serverId: string;
	player: Player;
};

function getCountryCode(locale: string): string {
	const parts = locale.split('_');
	return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase();
}

function PlayerCard({ serverId, player: { locale, userId, name, team, ip, uuid, isAdmin, joinedAt } }: PlayerCardProps) {
	locale = getCountryCode(locale ?? 'EN');

	return (
		<motion.div
			exit={{
				x: 1000, // move far right
				y: -300, // and up
				rotate: 720, // spin
				opacity: 0, // fade out
				scale: 0.5, // shrink
				transition: {
					duration: 1,
					ease: 'easeOut',
				},
			}}
			layout="position"
			className="flex overflow-hidden flex-col px-2 py-1 rounded-md bg-secondary"
		>
			<div className="flex gap-1 items-center">
				<div className="rounded-full size-2" style={{ backgroundColor: `#${team.color}` }} />
				<div className="flex gap-1 justify-between items-center w-full">
					<span className="flex gap-1 justify-center items-center">
						<span>{locale && (localeToFlag[locale] ?? locale)}</span>
						<ColorText className="font-semibold" text={name} />
						{isAdmin && ''}
					</span>
					<div className="flex gap-1 items-center">
						<TimeFrom time={joinedAt} />
						<EllipsisButton variant="ghost">
							<BanButton id={serverId} uuid={uuid} username={name} ip={ip} />
							<KickButton id={serverId} uuid={uuid} />
						</EllipsisButton>
					</div>
				</div>
			</div>
			{userId && <IdUserCard id={userId} avatar={false} />}
		</motion.div>
	);
}

function TimeFrom({ time }: { time: number }) {
	const [relative, setRelative] = useState('');

	useInterval(() => {
		const now = Date.now();
		const diff = now - time;
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) {
			setRelative(`${days}d${hours % 24}h${minutes % 60}m`);
		} else if (hours > 0) {
			setRelative(`${hours}h${minutes % 60}m`);
		} else if (minutes > 0) {
			setRelative(`${minutes}m${seconds % 60}s`);
		} else if (seconds > 0) {
			setRelative(`${seconds}s`);
		}
	}, 1000);

	return <span>{relative}</span>;
}

const localeToFlag: Record<string, string> = {
	EN: '🇬🇧',
	AD: '🇦🇩',
	AE: '🇦🇪',
	AF: '🇦🇫',
	AG: '🇦🇬',
	AI: '🇦🇮',
	AL: '🇦🇱',
	AM: '🇦🇲',
	AO: '🇦🇴',
	AQ: '🇦🇶',
	AR: '🇦🇷',
	AS: '🇦🇸',
	AT: '🇦🇹',
	AU: '🇦🇺',
	AW: '🇦🇼',
	AX: '🇦🇽',
	AZ: '🇦🇿',
	BA: '🇧🇦',
	BB: '🇧🇧',
	BD: '🇧🇩',
	BE: '🇧🇪',
	BF: '🇧🇫',
	BG: '🇧🇬',
	BH: '🇧🇭',
	BI: '🇧🇮',
	BJ: '🇧🇯',
	BL: '🇧🇱',
	BM: '🇧🇲',
	BN: '🇧🇳',
	BO: '🇧🇴',
	BQ: '🇧🇶',
	BR: '🇧🇷',
	BS: '🇧🇸',
	BT: '🇧🇹',
	BV: '🇧🇻',
	BW: '🇧🇼',
	BY: '🇧🇾',
	BZ: '🇧🇿',
	CA: '🇨🇦',
	CC: '🇨🇨',
	CD: '🇨🇩',
	CF: '🇨🇫',
	CG: '🇨🇬',
	CH: '🇨🇭',
	CI: '🇨🇮',
	CK: '🇨🇰',
	CL: '🇨🇱',
	CM: '🇨🇲',
	CN: '🇨🇳',
	CO: '🇨🇴',
	CR: '🇨🇷',
	CU: '🇨🇺',
	CV: '🇨🇻',
	CW: '🇨🇼',
	CX: '🇨🇽',
	CY: '🇨🇾',
	CZ: '🇨🇿',
	DE: '🇩🇪',
	DJ: '🇩🇯',
	DK: '🇩🇰',
	DM: '🇩🇲',
	DO: '🇩🇴',
	DZ: '🇩🇿',
	EC: '🇪🇨',
	EE: '🇪🇪',
	EG: '🇪🇬',
	EH: '🇪🇭',
	ER: '🇪🇷',
	ES: '🇪🇸',
	ET: '🇪🇹',
	FI: '🇫🇮',
	FJ: '🇫🇯',
	FK: '🇫🇰',
	FM: '🇫🇲',
	FO: '🇫🇴',
	FR: '🇫🇷',
	GA: '🇬🇦',
	GB: '🇬🇧',
	GD: '🇬🇩',
	GE: '🇬🇪',
	GF: '🇬🇫',
	GG: '🇬🇬',
	GH: '🇬🇭',
	GI: '🇬🇮',
	GL: '🇬🇱',
	GM: '🇬🇲',
	GN: '🇬🇳',
	GP: '🇬🇵',
	GQ: '🇬🇶',
	GR: '🇬🇷',
	GS: '🇬🇸',
	GT: '🇬🇹',
	GU: '🇬🇺',
	GW: '🇬🇼',
	GY: '🇬🇾',
	HK: '🇭🇰',
	HM: '🇭🇲',
	HN: '🇭🇳',
	HR: '🇭🇷',
	HT: '🇭🇹',
	HU: '🇭🇺',
	ID: '🇮🇩',
	IE: '🇮🇪',
	IL: '🇮🇱',
	IM: '🇮🇲',
	IN: '🇮🇳',
	IO: '🇮🇴',
	IQ: '🇮🇶',
	IR: '🇮🇷',
	IS: '🇮🇸',
	IT: '🇮🇹',
	JE: '🇯🇪',
	JM: '🇯🇲',
	JO: '🇯🇴',
	JA: '🇯🇵',
	JP: '🇯🇵',
	KE: '🇰🇪',
	KG: '🇰🇬',
	KH: '🇰🇭',
	KI: '🇰🇮',
	KM: '🇰🇲',
	KN: '🇰🇳',
	KP: '🇰🇵',
	KR: '🇰🇷',
	KO: '🇰🇷',
	KW: '🇰🇼',
	KY: '🇰🇾',
	KZ: '🇰🇿',
	LA: '🇱🇦',
	LB: '🇱🇧',
	LC: '🇱🇨',
	LI: '🇱🇮',
	LK: '🇱🇰',
	LR: '🇱🇷',
	LS: '🇱🇸',
	LT: '🇱🇹',
	LU: '🇱🇺',
	LV: '🇱🇻',
	LY: '🇱🇾',
	MA: '🇲🇦',
	MC: '🇲🇨',
	MD: '🇲🇩',
	ME: '🇲🇪',
	MF: '🇲🇫',
	MG: '🇲🇬',
	MH: '🇲🇭',
	MK: '🇲🇰',
	ML: '🇲🇱',
	MM: '🇲🇲',
	MN: '🇲🇳',
	MO: '🇲🇴',
	MP: '🇲🇵',
	MQ: '🇲🇶',
	MR: '🇲🇷',
	MS: '🇲🇸',
	MT: '🇲🇹',
	MU: '🇲🇺',
	MV: '🇲🇻',
	MW: '🇲🇼',
	MX: '🇲🇽',
	MY: '🇲🇾',
	MZ: '🇲🇿',
	NA: '🇳🇦',
	NC: '🇳🇨',
	NE: '🇳🇪',
	NF: '🇳🇫',
	NG: '🇳🇬',
	NI: '🇳🇮',
	NL: '🇳🇱',
	NO: '🇳🇴',
	NP: '🇳🇵',
	NR: '🇳🇷',
	NU: '🇳🇺',
	NZ: '🇳🇿',
	OM: '🇴🇲',
	PA: '🇵🇦',
	PE: '🇵🇪',
	PF: '🇵🇫',
	PG: '🇵🇬',
	PH: '🇵🇭',
	PK: '🇵🇰',
	PL: '🇵🇱',
	PM: '🇵🇲',
	PN: '🇵🇳',
	PR: '🇵🇷',
	PS: '🇵🇸',
	PT: '🇵🇹',
	PW: '🇵🇼',
	PY: '🇵🇾',
	QA: '🇶🇦',
	RE: '🇷🇪',
	RO: '🇷🇴',
	RS: '🇷🇸',
	RU: '🇷🇺',
	RW: '🇷🇼',
	SA: '🇸🇦',
	SB: '🇸🇧',
	SC: '🇸🇨',
	SD: '🇸🇩',
	SE: '🇸🇪',
	SG: '🇸🇬',
	SH: '🇸🇭',
	SI: '🇸🇮',
	SJ: '🇸🇯',
	SK: '🇸🇰',
	SL: '🇸🇱',
	SM: '🇸🇲',
	SN: '🇸🇳',
	SO: '🇸🇴',
	SR: '🇸🇷',
	SS: '🇸🇸',
	ST: '🇸🇹',
	SV: '🇸🇻',
	SX: '🇸🇽',
	SY: '🇸🇾',
	SZ: '🇸🇿',
	TC: '🇹🇨',
	TD: '🇹🇩',
	TF: '🇹🇫',
	TG: '🇹🇬',
	TH: '🇹🇭',
	TJ: '🇹🇯',
	TK: '🇹🇰',
	TL: '🇹🇱',
	TM: '🇹🇲',
	TN: '🇹🇳',
	TO: '🇹🇴',
	TR: '🇹🇷',
	TT: '🇹🇹',
	TV: '🇹🇻',
	TW: '🇹🇼',
	TZ: '🇹🇿',
	UA: '🇺🇦',
	UG: '🇺🇬',
	UM: '🇺🇲',
	US: '🇺🇸',
	UY: '🇺🇾',
	UZ: '🇺🇿',
	VA: '🇻🇦',
	VC: '🇻🇨',
	VE: '🇻🇪',
	VG: '🇻🇬',
	VI: '🇻🇳',
	VN: '🇻🇳',
	VU: '🇻🇺',
	WF: '🇼🇫',
	WS: '🇼🇸',
	XK: '🇽🇰',
	YE: '🇾🇪',
	YT: '🇾🇹',
	ZA: '🇿🇦',
	ZM: '🇿🇲',
	ZW: '🇿🇼',
};
