import { DetailRow } from '@/components/common/detail';
import Tran from '@/components/common/tran';

export default function CreatedAt({ createdAt }: { createdAt: string }) {
	const created = new Date(createdAt);
	const now = new Date();
	const isSameDay =
		created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth() && created.getDate() === now.getDate();
	return (
		<DetailRow>
			<Tran text="created-at" />
			<span className="text-foreground">{isSameDay ? created.toLocaleTimeString() : created.toLocaleDateString()}</span>
		</DetailRow>
	);
}
