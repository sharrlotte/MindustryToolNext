import env from '@/constant/env';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

type SocketState =
  | 'uninitiated'
  | 'initiating'
  | 'connecting'
  | 'connected'
  | 'disconnected';

export default function useSocket() {
  const [socket, setSocket] = useState<ReconnectingWebSocket | undefined>();

  const { data: session } = useSession();
  const [state, setState] = useState<SocketState>('uninitiated');

  const accessToken = session?.user?.accessToken;
  useEffect(() => {
    setState('initiating');

    if (!accessToken) {
      setState('uninitiated');
      return;
    }

    setState('connecting');

    const s = new ReconnectingWebSocket(
      `${env.url.socket}/socket?accessToken=${accessToken}`,
    );

    s.onopen = () => {
      setState('connected');
    };
    s.close = () => setState('disconnected');
    s.onerror = (err) => {
      console.log(err);
      setState('disconnected');
    };

    setSocket(s);

    return () => {
      s?.close();
      setState('disconnected');
    };
  }, [accessToken]);

  return { socket: socket, state };
}
