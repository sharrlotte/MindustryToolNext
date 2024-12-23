import React from 'react';

import IdUserCard from '@/components/user/id-user-card';

import { Log } from '@/types/response/Log';

type LogCardProps = {
  log: Log;
  onClick: (data: { ip?: string; userId?: string; url?: string; content?: string }) => void;
};

export default function LogCard({ log: { requestUrl, ip, userId, content, createdAt, environment }, onClick }: LogCardProps) {
  return (
    <div className="flex w-full flex-col break-words rounded-md bg-card p-2 text-xs h-full">
      {userId && (
        <span onClick={() => onClick({ userId })}>
          <IdUserCard id={userId} />
        </span>
      )}
      {requestUrl && <span onClick={() => onClick({ url: requestUrl })}>URL: {requestUrl}</span>}
      <span onClick={() => onClick({ ip })}>IP: {ip}</span>
      Env: {environment === 1 ? 'Prod' : 'Dev'}
      <div onClick={() => onClick({ content })}>
        Content:
        {content.split('\n').map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </div>
      <span>Created at: {new Date(createdAt).toLocaleString()}</span>
    </div>
  );
}
