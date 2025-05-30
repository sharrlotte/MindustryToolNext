import { CheckIcon, XIcon } from 'lucide-react';

import LoadingSpinner from '@/components/common/loading-spinner';

import { useMutation } from '@tanstack/react-query';

type TranslationStatusProps = {
	status: ReturnType<typeof useMutation>['status'];
};
export default function TranslationStatus({ status }: TranslationStatusProps) {
	if (status === 'idle') return null;

	if (status === 'pending') {
		return <LoadingSpinner className="p-0 m-0" />;
	}

	if (status === 'success') {
		return <CheckIcon className="text-success-foreground" />;
	}

	return <XIcon className="text-destructive-foreground" />;
}
