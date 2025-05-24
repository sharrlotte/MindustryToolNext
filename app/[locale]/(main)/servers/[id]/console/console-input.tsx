'use client';

import { ComponentPropsWithRef, ReactNode } from 'react';

import ErrorMessage from '@/components/common/error-message';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import ChatInput from '@/components/messages/chat-input';

import useClientApi from '@/hooks/use-client';
import useServerStatus from '@/hooks/use-server-status';
import { getServerCommands, getServerPlayers } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

export default function ConsoleInput({ id, room }: { room: string; id: string }) {
	const axios = useClientApi();
	const status = useServerStatus(id);

	const { data, isError, error } = useQuery({
		queryKey: ['server', id, 'command'],
		queryFn: () => getServerCommands(axios, id),
		enabled: status === 'AVAILABLE',
		placeholderData: [],
	});

	const { data: players } = useQuery({
		queryKey: ['server', id, 'player'],
		queryFn: () => getServerPlayers(axios, id),
		enabled: status === 'AVAILABLE',
		placeholderData: [],
	});

	return (
		<ChatInput
			room={room}
			placeholder="/help"
			onKeyPress={(event) => {
				if (event.key === 'Tab') {
					return true;
				}
			}}
			autocomplete={({ message, setMessage, ref }) => {
				if (!message.startsWith('/')) {
					return null;
				}

				if (isError) {
					return (
						<AutocompleteContainer>
							<AutocompleteCard>
								<ErrorMessage error={error} />
							</AutocompleteCard>
						</AutocompleteContainer>
					);
				}

				const parts = message.split(' ');

				// Focusing on command
				if (parts.length === 0 || parts.length === 1) {
					const filteredCommands =
						data?.filter(
							(command) =>
								command.text.includes(message.substring(1)) ||
								command.paramText.includes(message.substring(1)) ||
								command.description.includes(message.substring(1)),
						) ?? [];

					if (filteredCommands?.length === 0) {
						return (
							<AutocompleteContainer>
								<AutocompleteCard>
									<Tran text="no-option" />
								</AutocompleteCard>
							</AutocompleteContainer>
						);
					}

					return (
						<AutocompleteContainer>
							{filteredCommands.map((command) => (
								<AutocompleteCard
									key={command.text}
									onClick={() => {
										setMessage('/' + command.text + ' ');
										ref?.focus();
									}}
								>
									<div className="space-x-2">
										<span>{command.text}</span>
										<span>{command.paramText}</span>
									</div>
									<p className="text-xs text-muted-foreground">{command.description}</p>
								</AutocompleteCard>
							))}
						</AutocompleteContainer>
					);
				}

				const index = parts.filter(Boolean).length - 1;

				const command = data?.find((command) => command.text === parts[0].substring(1));

				if (!command) {
					return null;
				}

				if (index >= command.params.length) {
					return null;
				}

				const param = command.params[index];

				if (!param) {
					return null;
				}

				let options = param.name.split('/');

				switch (param.name.toLowerCase()) {
					case 'id':
						options = players?.map((player) => player.uuid) ?? [];
						break;

					case 'command':
						options = data?.map((command) => command.text) ?? [];
						break;

					case 'username':
						options = players?.map((player) => player.name) ?? [];
						break;
				}

				const isOption = options.length > 1;

				if (isOption) {
					return (
						<AutocompleteContainer>
							{options.map((option) => (
								<AutocompleteCard
									key={option}
									onClick={() => {
										setMessage(message + option + ' ');
										ref?.focus();
									}}
								>
									{option}
								</AutocompleteCard>
							))}
						</AutocompleteContainer>
					);
				}
			}}
		/>
	);
}

function AutocompleteContainer({ children }: { children: ReactNode }) {
	return (
		<div className="p-1 absolute -top-1 left-0 right-0 -translate-y-full border rounded-md bg-background overflow-hidden">
			<ScrollContainer id="console-autocomplete" className="flex flex-col gap-1 max-h-[50vh]">
				{children}
			</ScrollContainer>
		</div>
	);
}

function AutocompleteCard({ children, ...props }: ComponentPropsWithRef<'div'> & { children: ReactNode }) {
	return (
		<div className="p-2 bg-secondary/60 rounded-md hover:bg-secondary cursor-pointer" {...props}>
			{children}
		</div>
	);
}
