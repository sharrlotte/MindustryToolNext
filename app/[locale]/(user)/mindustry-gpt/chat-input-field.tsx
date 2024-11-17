import { KeyboardEventHandler } from 'react';

import { AutosizeTextarea } from '@/components/ui/autoresize-textarea';
import { useI18n } from '@/i18n/client';

type ChatInputFieldProps = {
  reset: number;
  setPrompt: (data: string) => void;
  handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement>;
};

export default function ChatInputField({ reset, setPrompt, handleKeyPress }: ChatInputFieldProps) {
  const t = useI18n();

  return (
    <AutosizeTextarea
      key={reset}
      className="max-h-56 min-h-full w-full max-w-[100vw] overflow-y-auto overflow-x-hidden p-1 focus-visible:outline-none"
      placeholder={t('chat.input-place-holder')}
      onChange={(event) => setPrompt(event.target.value ?? '')}
      onKeyDown={handleKeyPress}
    />
  );
}
