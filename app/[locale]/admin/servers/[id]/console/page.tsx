'use client';

import ColorText from '@/components/common/color-text';
import LoadingSpinner from '@/components/common/loading-spinner';
import { Button } from '@/components/ui/button';
import useSearchId from '@/hooks/use-search-id-params';
import useSocket from '@/hooks/use-socket';
import { isReachedEnd } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import React, {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

export default function Page() {
  const { id } = useSearchId();

  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  let [messagesCursor, setMessageCursor] = useState(0);

  const { socket, state, isAuthenticated } = useSocket();

  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const containerRef = useRef<HTMLDivElement | null>();
  const bottomRef = useRef<HTMLSpanElement | null>();

  const t = useI18n();

  const addLog = (message: string[]) => {
    setLog((prev) => [...prev, ...message]);

    setTimeout(() => {
      if (!bottomRef.current || !containerRef.current) {
        return;
      }

      if (!isReachedEnd(containerRef.current)) {
        return;
      }

      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (socket && state === 'connected' && isAuthenticated) {
      socket.send({ method: 'JOIN_ROOM', data: `SERVER-${id}` });
      socket.onRoom(`SERVER-${id}`).send({ method: 'LOAD' });

      socket
        .onRoom(`SERVER-${id}`)
        .onMessage('LOAD', (message) => addLog(message));

      socket
        .onRoom(`SERVER-${id}`)
        .onMessage('SERVER_MESSAGE', (message) => addLog([message]));
    }
  }, [id, socket, state, isAuthenticated]);

  function sendMessage(message: string) {
    let data = '';
    if (message.startsWith('/')) {
      data = message.substring(1);
    } else {
      data = `say ${message}`;
    }

    if (socket && state === 'connected') {
      setMessage('');
      socket.onRoom(`SERVER-${id}`).send({ data, method: 'SERVER_MESSAGE' });

      setMessageHistory((prev) => {
        const v = [...prev, message];
        setMessageCursor(v.length - 1);

        return v;
      });
    }
  }

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    sendMessage(message);
    event.preventDefault();
  };

  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (messageHistory.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp': {
        setMessageCursor((prev) => {
          prev--;

          if (prev < 0) {
            return messageHistory.length - 1;
          }

          return prev;
        });
        setMessage(messageHistory[messagesCursor]);
        break;
      }

      case 'ArrowDown': {
        setMessageCursor((prev) => {
          prev++;

          prev = prev % messageHistory.length;

          return prev;
        });
        setMessage(messageHistory[messagesCursor]);
        break;
      }
    }
  }

  return (
    <div className="grid h-full w-full grid-rows-[1fr_3rem] gap-2 overflow-hidden bg-card px-2 pt-2">
      <div className="grid h-full w-full overflow-hidden">
        <div
          className="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden bg-black/80 text-white"
          ref={(ref) => {
            containerRef.current = ref;
          }}
        >
          {state !== 'connected' ? (
            <LoadingSpinner className="m-auto h-6 w-6 flex-1" />
          ) : (
            log.map((item, index) => (
              <ColorText
                className="text-wrap px-2 py-1"
                key={index}
                text={item}
              />
            ))
          )}
          <span
            ref={(ref) => {
              bottomRef.current = ref;
            }}
          ></span>
        </div>
      </div>
      <form
        className="flex h-10 flex-1 gap-1"
        name="text"
        onSubmit={handleFormSubmit}
      >
        <input
          className="h-full w-full rounded-sm border border-border bg-background px-2 outline-none"
          value={message}
          onKeyDown={handleKeyPress}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />
        <Button
          className="h-full"
          variant="primary"
          type="submit"
          title={t('send')}
          disabled={state !== 'connected' || !message}
        >
          {t('send')}
        </Button>
      </form>
    </div>
  );
}
