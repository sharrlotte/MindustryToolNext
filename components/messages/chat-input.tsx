'use client';

import { Theme } from 'emoji-picker-react';
import { SendIcon, SmileIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { KeyboardEvent, useRef, useState } from 'react';

import { AutosizeTextAreaRef, AutosizeTextarea } from '@/components/ui/autoresize-textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { maxMessageLength } from '@/constant/constant';
import { useSocket } from '@/context/socket.context';
import useMessage from '@/hooks/use-message';
import { cn } from '@/lib/utils';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

type ChatInputProps = {
	className?: string;
	placeholder?: string;
	room: string;
	autocomplete?: (value: {
		message: string;
		setMessage: (data: string) => void;
		ref: AutosizeTextAreaRef | null;
	}) => React.ReactNode;
	// Skip the default behavior of the form submit if result is true
	onKeyPress?: (event: KeyboardEvent<HTMLTextAreaElement>) => boolean | void;
} & React.ComponentPropsWithoutRef<HTMLTextAreaElement>;

export default function ChatInput({ className, room, placeholder, autocomplete, onKeyPress, ...props }: ChatInputProps) {
	const { state } = useSocket();
	const { theme } = useTheme();
	const ref = useRef<AutosizeTextAreaRef>(null);

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
		if (onKeyPress) {
			const result = onKeyPress(event);

			if (result) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}
		}

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
			className={cn('flex min-h-12 flex-1 border-t h-fit flex-col gap-1', className)}
			name="text"
			onSubmit={(event) => {
				handleFormSubmit();
				event.preventDefault();
			}}
		>
			<div className="border relative border-border flex gap-1 rounded-md w-full bg-card">
				{autocomplete && autocomplete({ message, setMessage, ref: ref.current })}
				<AutosizeTextarea
					className="h-full w-full bg-card px-2 outline-none border-none min-h-12 resize-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
					value={message}
					placeholder={placeholder}
					onKeyDown={handleKeyPress}
					onChange={(event) => setMessage(event.currentTarget.value)}
					ref={ref}
					{...props}
				/>
				<div className="mt-auto mb-1 mx-1 flex items-center gap-2 min-h-9">
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
						className="bg-brand rounded-sm"
						variant="ghost"
						type="submit"
						title="send"
						disabled={state !== 'connected' || !message || message.length > maxMessageLength}
					>
						<SendIcon />
					</Button>
				</div>
			</div>
			<div className="flex justify-end text-sm w-full">
				<span className={cn('text-muted-foreground', { 'text-destructive-foreground': message.length > maxMessageLength })}>
					<span>{message.length}</span>/<span className="text-foreground">{maxMessageLength}</span>
				</span>
			</div>
		</form>
	);
}
