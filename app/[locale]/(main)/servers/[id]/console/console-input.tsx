'use client';

import ErrorMessage from '@/components/common/error-message';
import ScrollContainer from '@/components/common/scroll-container';
import ChatInput from '@/components/messages/chat-input';

import useClientApi from '@/hooks/use-client';
import { getServerCommands } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

export default function ConsoleInput({ id, room }: { room: string; id: string }) {
	const axios = useClientApi();

	const { data, isError, error } = useQuery({
		queryKey: ['server', id, 'command'],
		queryFn: () => getServerCommands(axios, id),
	});

	return (
		<ChatInput
			room={room}
			placeholder="/help"
			onKeyPress={(event) => {}}
			autocomplete={(message, setMessage) => {
				if (isError) {
					return <ErrorMessage error={error} />;
				}

				if (!message.startsWith('/')) {
					return null;
				}

				const parts = message.split(' ');

				// Focusing on command
				if (parts.length === 0 || parts.length === 1) {
					return (
						<div className="p-1 absolute -top-1 left-0 right-0 -translate-y-full border rounded-md bg-background overflow-hidden">
							<ScrollContainer id="console-autocomplete" className="flex flex-col gap-1 max-h-[50vh]">
								{data
									?.filter((command) => command.text.startsWith(message.substring(1)))
									.map((command) => (
										<div
											className="p-2 bg-secondary/60 rounded-md hover:bg-secondary cursor-pointer"
											key={command.text}
											onClick={() => setMessage('/' + command.text + ' ')}
										>
											<div className="space-x-2">
												<span>{command.text}</span>
												<span>{command.paramText}</span>
											</div>
											<p className="text-xs text-muted-foreground">{command.description}</p>
										</div>
									))}
							</ScrollContainer>
						</div>
					);
				}
			}}
		/>
	);
}
