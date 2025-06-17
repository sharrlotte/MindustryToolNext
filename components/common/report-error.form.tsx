import { SendIcon } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';

import Tran from '@/components/common/tran';
import { AutosizeTextarea } from '@/components/ui/autoresize-textarea';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import Divider from '@/components/ui/divider';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import { errors } from '@/lib/error';

import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import env from '@/constant/env';

const EXPLAIN_MESSAGE = `If you encountered an error, please let us know what happened. To help us fix it, describe:

What you were doing when the error occurred

The steps to reproduce the error (if possible)

Any error messages you saw

The more details you provide, the easier it is for us to solve the problem. Thank you!`;

export default function ReportErrorForm() {
	const [message, setMessage] = useLocalStorage('error-message', '');
	const axios = useClientApi();
	const { mutate, isPending } = useMutation({
		mutationFn: () => {
			const data = {
				url: window.location.href,
				message,
				errors: errors.join('\n'),
			};

			errors.length = 0;

			return axios.post('/error-report', data, {
				data,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		},
		onSuccess: () => toast.success('Your report has been sent.'),
		onError: () => toast.error('Something went wrong.'),
	});

	return (
		<div className="flex flex-col gap-4 p-8 border rounded-md">
			<DialogTitle>
				<Tran text="report-error" />
			</DialogTitle>
			<div className="flex flex-col gap-2">
				<AutosizeTextarea
					className="min-h-[250px] focus-visible:ring-0"
					value={message}
					placeholder={EXPLAIN_MESSAGE}
					minHeight={250}
					onChange={(event) => setMessage(event.currentTarget.value)}
				/>
				<Button variant="secondary" disabled={isPending || message.length === 0} onClick={() => mutate()}>
					<SendIcon className="size-5" />
					<Tran text="send" />
				</Button>
			</div>
			<Divider />
			<span>
				<Tran text="or-report-error-via-discord" />
			</span>
			<a
				className="font-semibold h-9 gap-1 bg-[rgb(88,101,242)] text-nowrap rounded-md border border-border flex justify-center items-center px-4 py-2"
				href={env.url.discordServer}
				target="_blank"
				rel="noopener noreferrer"
			>
				<DiscordLogoIcon className="size-5" /> <Tran text="discord" />
			</a>
		</div>
	);
}
