import IdUserCard from '@/components/user/id-user-card';
import { Log } from '@/types/response/Log';

import React from 'react';

type LogCardProps = {
  log: Log;
  onClick: (data: { ip?: string; userId?: string; url?: string; content?: string }) => void;
};

export default function LogCard({ log: { requestUrl, ip, userId, content, createdAt, environment }, onClick }: LogCardProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden break-words rounded-md bg-card p-2 text-xs">
      {userId && (
        <span onClick={() => onClick({ userId })}>
          <IdUserCard id={userId} />
        </span>
      )}
      {requestUrl && <span onClick={() => onClick({ url: requestUrl })}>URL: {requestUrl}</span>}
      <span onClick={() => onClick({ ip })}>IP: {ip}</span>
      Env: {environment === 1 ? 'Prod' : 'Dev'}
      <span onClick={() => onClick({ content })}>Content: {content}</span>
      <span>Created at: {new Date(createdAt).toLocaleString()}</span>
    </div>
  );
}
