import { KeyboardEventHandler } from 'react';

import { AutosizeTextarea } from '@/components/ui/autoresize-textarea';

import { useI18n } from '@/i18n/client';

type PromptInputProps = {
	reset: number;
	setPrompt: (data: string) => void;
	handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement>;
};

export default function PromptInput({ reset, setPrompt, handleKeyPress }: PromptInputProps) {
	const { t } = useI18n('chat');

	return (
		<AutosizeTextarea
			key={reset}
			className="max-h-56 min-h-full resize-none w-full max-w-[100vw] overflow-x-hidden p-1 focus-visible:outline-none border-transparent focus-visible:shadow-none focus-visible:ring-offset-0 bg-transparent focus-visible:ring-transparent"
			placeholder={t('input-place-holder')}
			onChange={(event) => setPrompt(event.target.value ?? '')}
			onKeyDown={handleKeyPress}
		/>
	);
}
