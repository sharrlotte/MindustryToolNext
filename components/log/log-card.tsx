import { Log } from '@/types/response/Log';
import moment from 'moment';
import React from 'react';

type LogCardProps = {
  log: Log;
};

export default function LogCard({ log }: LogCardProps) {
  return (
    <div className="no-scrollbar flex h-full w-full flex-col overflow-hidden rounded-md bg-card p-2">
      <span>URL: {log.requestUrl}</span>
      <span>IP: {log.ip}</span>
      <span>UserID: {log.userId}</span>
      <span>Content: {log.content}</span>
      <span>Environment: {log.environment}</span>
      <span>Created at: {moment(log.createdAt).fromNow()}</span>
      <span>Created at: {new Date(log.createdAt).toUTCString()}</span>
    </div>
  );
}
