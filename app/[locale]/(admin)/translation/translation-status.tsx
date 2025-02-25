import { CheckCircleIcon, XCircleIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/router-spinner';

import { useMutation } from '@tanstack/react-query';

type TranslationStatusProps = {
  status: ReturnType<typeof useMutation>['status'];
};
export default function TranslationStatus({ status }: TranslationStatusProps) {
  return status === 'idle' ? (
    <CheckCircleIcon /> //
  ) : status === 'pending' ? (
    <LoadingSpinner className="p-0 m-0" />
  ) : status === 'success' ? (
    <CheckCircleIcon className="text-success" />
  ) : (
    <XCircleIcon className="text-destructive" />
  );
}
