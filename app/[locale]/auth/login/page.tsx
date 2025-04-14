import { DiscordIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';

import env from '@/constant/env';

export default function Page() {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-2">
			<div className="grid gap-3">
				<div className="text-xl font-bold md:text-2xl">Login to your account</div>
				<a className=" rounded-md border bg-[rgb(88,101,242)] p-2 transition-colors hover:bg-[rgb(76,87,214)]" href={`${env.url.api}/oauth2/discord`}>
					<div className="flex items-center justify-center gap-1">
						<DiscordIcon /> <Tran text="login.continue-with-discord" />
					</div>
				</a>
				<a className=" rounded-md border bg-white p-2 text-gray-800 transition-colors hover:bg-gray-300" href={`${env.url.api}/oauth2/google`}>
					<div className="flex items-center justify-center gap-1">
						<Tran text="login.continue-with-google" /> <p>(Not support yet)</p>
					</div>
				</a>
			</div>
		</div>
	);
}
