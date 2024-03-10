import { Log } from '@/types/response/Log';
import moment from 'moment';
import React from 'react';

type LogCardProps = {
  log: Log;
};

export default function LogCard({ log }: LogCardProps) {
  return (
    <div className="no-scrollbar grid w-full overflow-x-auto rounded-md bg-card p-2">
      <span>URL: {log.requestUrl}</span>
      <span>IP: {log.ip}</span>
      <span>UserID: {log.userId}</span>
      <span>Content: {log.content}</span>
      <span>Environment: {log.environment}</span>
      <span>
        Created at: {moment(new Date(log.createdAt).toISOString()).fromNow()}
      </span>
    </div>
  );
}
