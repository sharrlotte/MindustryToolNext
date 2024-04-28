import { Log } from '@/types/response/Log';
import moment from 'moment';
import React from 'react';

type LogCardProps = {
  log: Log;
};

export default function LogCard({
  log: { requestUrl, ip, userId, content, environment, createdAt },
}: LogCardProps) {
  return (
    <div className="no-scrollbar flex h-full w-full flex-col rounded-md bg-card p-2">
      {requestUrl && <span>URL: {requestUrl}</span>}
      <span>IP: {ip}</span>
      {userId && <span>UserID: {userId}</span>}
      <span>Content: {content}</span>
      <span>Created at: {moment(createdAt).fromNow()}</span>
      <span>Created at: {new Date(createdAt).toLocaleString('vi')}</span>
    </div>
  );
}
