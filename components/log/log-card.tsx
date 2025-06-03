import Image from 'next/image';
import React from 'react';

import IdUserCard from '@/components/user/id-user-card';

import { Log } from '@/types/Log';

type LogCardProps = {
	log: Log;
};

export default function LogCard({ log: { requestUrl, ip, userId, content, createdAt, environment, type } }: LogCardProps) {
	return (
		<div className="flex w-full flex-col break-words rounded-md bg-card p-2 text-xs h-full">
			{userId && (
				<span>
					<IdUserCard id={userId} />
				</span>
			)}
			{requestUrl && <span>URL: {requestUrl}</span>}
			<span>IP: {ip}</span>
			Env: {environment === 1 ? 'Prod' : 'Dev'}
			{type === 11 ? (
				<Image className="size-16" src={content} width={64} height={64} alt={content} />
			) : (
				<div>
					Content:
					{content.split('\n').map((item, index) => (
						<span key={index}>{item}</span>
					))}
				</div>
			)}
			<span>Created at: {new Date(createdAt).toLocaleString()}</span>
		</div>
	);
}
