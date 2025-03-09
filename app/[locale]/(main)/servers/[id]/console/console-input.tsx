'use client';

import { FormEvent, KeyboardEvent, useState } from 'react';

import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useSocket } from '@/context/socket-context';
import useMessage from '@/hooks/use-message';

type ConsoleInputProps = {
  id: string;
};

export default function ConsoleInput({ id }: ConsoleInputProps) {
  const { state } = useSocket();

  const [message, setMessage] = useState<string>('');

  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [messagesCursor, setMessageCursor] = useState(0);

  const { sendMessage } = useMessage({
    room: `SERVER-${id}`,
    method: 'MESSAGE',
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (message.startsWith('/')) {
      sendMessage(message.substring(1));
    } else {
      sendMessage('say ' + message);
    }
    setMessageHistory((prev) => [...prev, message]);
    setMessage('');
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
    <form className="flex h-full flex-1 gap-1" name="text" onSubmit={handleFormSubmit}>
      <Input className="h-full w-full rounded-sm border border-border bg-background px-2 outline-none" value={message} placeholder="/help" onKeyDown={handleKeyPress} onChange={(event) => setMessage(event.currentTarget.value)} />
      <Button className="h-full" variant="primary" type="submit" title="send" disabled={state !== 'connected' || !message}>
        <Tran text="send" />
      </Button>
    </form>
  );
}
