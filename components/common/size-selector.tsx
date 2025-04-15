import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import ComboBox from '@/components/common/combo-box';

import { useSession } from '@/context/session.context';

type SizeSelectorProps = {
	sizes: number[];
};
export default function SizeSelector({ sizes }: SizeSelectorProps) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const {
		config: { paginationSize: size },
		setConfig,
	} = useSession();

	const handleSizeChange = useCallback(
		(size: number | undefined) => {
			setConfig('paginationSize', size ?? 10);

			const path = new URLSearchParams(searchParams);
			path.set('size', (size ?? 10).toString());
			router.replace(`?${path.toString()}`);
		},
		[router, searchParams, setConfig],
	);

	return (
		<ComboBox
			className="w-20 rounded-md border-transparent h-10 bg-card"
			searchBar={false}
			value={{ label: size.toString(), value: size }}
			values={sizes.map((size) => ({
				label: size.toString(),
				value: size,
			}))}
			onChange={handleSizeChange}
		/>
	);
}
