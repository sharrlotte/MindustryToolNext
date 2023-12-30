'use client';

import { Button } from '@/components/ui/button';
import env from '@/constant/env';
import { useSession } from 'next-auth/react';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

let socket: ReconnectingWebSocket | undefined;

type SocketState =
  | 'uninitiated'
  | 'initiating'
  | 'connecting'
  | 'connected'
  | 'disconnected';

export default function LogPage() {
  const { data: session } = useSession();

  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [state, setState] = useState<SocketState>('uninitiated');
  const bottomRef = useRef<HTMLSpanElement | null>();

  const accessToken = session?.user?.accessToken;

  const initSocket = useCallback(() => {
    if (socket) {
      socket.close();
    }

    setState('initiating');

    if (!accessToken) {
      setState('uninitiated');
      return;
    }

    setState('connecting');

    socket = new ReconnectingWebSocket(
      `${env.url.socket}/socket?accessToken=${accessToken}`,
    );

    socket.onopen = () => {
      setState('connected');
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    socket.close = () => setState('disconnected');
    socket.onerror = (err) => {
      console.log(err);
      setState('disconnected');
    };
    socket.onmessage = ({ data }) => addLog(JSON.parse(data));

    return () => {
      socket?.close();
      setState('disconnected');
    };
  }, [accessToken]);

  useEffect(() => initSocket(), [initSocket]);

  const addLog = (message: string[]) => {
    setLog((prev) => [...prev, ...message]);
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const sendMessage = () => {
    if (socket && state === 'connected') {
      socket.send(message);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setMessage('');
    } else if (state === 'uninitiated' || state === 'disconnected') {
      initSocket();
    }
  };

  return (
    <Fragment>
      <div className="flex h-full w-full flex-col">
        <div className="grid h-[calc(100%-5.5rem)] gap-2 overflow-auto p-2">
          {log.slice(log.length - 200).map((item, index) => (
            <p className="rounded-lg bg-zinc-900 p-2" key={index}>
              {item}
            </p>
          ))}
          <span ref={(ref) => (bottomRef.current = ref)}></span>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 m-2 flex h-10 gap-2">
        <input
          className="h-full w-full rounded-md border border-border bg-background outline-none"
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <Button
          title="send"
          onClick={sendMessage}
          disabled={state !== 'connected'}
        >
          Send
        </Button>
      </div>
    </Fragment>
  );
}
