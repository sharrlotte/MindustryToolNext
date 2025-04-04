import LoadingSpinner from '@/components/common/router-spinner';

import { useMutation } from '@tanstack/react-query';
import { CheckIcon, XIcon } from '@/components/common/icons';

type TranslationStatusProps = {
  status: ReturnType<typeof useMutation>['status'];
};
export default function TranslationStatus({ status }: TranslationStatusProps) {
  if (status === 'idle') return null;

  if (status === 'pending') {
    return <LoadingSpinner className="p-0 m-0" />;
  }

  if (status === 'success') {
    return <CheckIcon className="text-success" />;
  }

  return <XIcon className="text-destructive" />;
}
