import { useParams } from 'next/navigation';

export default function usePathId(key: string = 'id') {
	const params = useParams();
	return params[key] as string;
}
