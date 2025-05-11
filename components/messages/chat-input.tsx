'use client';

import { Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { KeyboardEvent, useState } from 'react';

import { SendIcon, SmileIcon } from '@/components/common/icons';
import { AutosizeTextarea } from '@/components/ui/autoresize-textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useSocket } from '@/context/socket.context';
import useMessage from '@/hooks/use-message';
import { cn } from '@/lib/utils';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function ChatInput({ className, room, placeholder }: { className?: string; placeholder?: string; room: string }) {
	const { state } = useSocket();
	const { theme } = useTheme();

	const [message, setMessage] = useState<string>('');

	const [messageHistory, setMessageHistory] = useState<string[]>([]);
	const [messagesCursor, setMessageCursor] = useState(0);

	const { sendMessage } = useMessage({
		room,
		method: 'MESSAGE',
	});

	const handleFormSubmit = () => {
		sendMessage(message);
		setMessageHistory((prev) => [...prev, message]);
		setMessage('');
	};

	function handleKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
		switch (event.key) {
			case 'ArrowUp': {
				if (messageHistory.length === 0) {
					return;
				}
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
				if (messageHistory.length === 0) {
					return;
				}

				setMessageCursor((prev) => {
					prev++;

					prev = prev % messageHistory.length;

					return prev;
				});
				setMessage(messageHistory[messagesCursor]);
				break;
			}

			case 'Enter': {
				if (event.shiftKey) {
					return;
				}

				event.preventDefault();
				handleFormSubmit();
				break;
			}
		}
	}
	return (
		<form
			className={cn('flex min-h-13 flex-1 gap-2 p-2 border-t', className)}
			name="text"
			onSubmit={(event) => {
				handleFormSubmit();
				event.preventDefault();
			}}
		>
			<div className="border border-border flex gap-1 rounded-md w-full bg-card">
				<AutosizeTextarea
					className="h-full w-full bg-card px-2 outline-none border-none min-h-13 resize-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
					value={message}
					placeholder={placeholder}
					onKeyDown={handleKeyPress}
					onChange={(event) => setMessage(event.currentTarget.value)}
				/>
				<div className="m-1 mt-auto flex items-center gap-2 min-h-9">
					<Popover>
						<PopoverTrigger>
							<SmileIcon />
						</PopoverTrigger>
						<PopoverContent className="border-transparent bg-transparent">
							<EmojiPicker
								theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
								onEmojiClick={(emoji) => {
									setMessage(message + emoji.emoji);
								}}
							/>
						</PopoverContent>
					</Popover>
					<Button
						className="text-brand"
						variant="ghost"
						size="icon"
						type="submit"
						title="send"
						disabled={state !== 'connected' || !message}
					>
						<SendIcon />
					</Button>
				</div>
			</div>
		</form>
	);
}
