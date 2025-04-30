import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function useQueryState<T extends Record<string, string | null>>(initialState: T) {
	const params = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const [currentValue, setCurrentValue] = useState(initialState);

	useEffect(() => {
		const result: Record<string, string> = {};

		for (const key of params.keys()) {
			const value = params.get(key);
			if (value !== undefined && value !== null && value !== '') {
				result[key] = value;
			}
		}

		setCurrentValue(result as T);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setter = useCallback(
		(value: Record<string, string | undefined | null>) => {
			const queryParams = new URLSearchParams(params);

			value = { ...currentValue, ...value };

			const filteredValue = Object.fromEntries(Object.entries(value).filter(([_, value]) => value !== undefined)) as Record<
				string,
				string
			>;

			Object.entries(value).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') queryParams.set(key, value);
				else queryParams.delete(key);
			});

			setCurrentValue(filteredValue as T);
			navigate(queryParams);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[params, router],
	);

	function navigate(queryParams: URLSearchParams) {
		let isTheSame = true;

		if (params.keys().toArray().length !== queryParams.keys().toArray().length) {
			isTheSame = false;
		}

		if (isTheSame) {
			for (const key of params.keys()) {
				if (params.get(key) !== queryParams.get(key)) {
					isTheSame = false;
				}
			}
		}

		if (!isTheSame) {
			router.push(`${pathname}?${queryParams.toString()}`);
		}
	}

	let result: Record<string, string> = Object.fromEntries(params.entries());

	Object.entries(currentValue).forEach(([key, value]) => {
		if (value) result[key] = value;
	});

	Object.entries(result).forEach(([key, value]) => {
		if (!value) {
			delete result[key];
		}
	});

	result = { ...initialState, ...result };

	return [result, setter] as const;
}
