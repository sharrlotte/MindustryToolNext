import { Like } from '@/types/response/Like';

import axiosInstance from '@/query/config/config';
import { User } from '@/query/user';

export class Batcher<T, R> {
	private static batchers: Batcher<any, any>[] = [];

	static like = new Batcher<string, Like>(
		async (ids) => axiosInstance.post('likes/batch', ids, { withCredentials: true }).then((res) => res.data),
		(results, id) => results.find((result) => result.itemId === id),
	);

	static user = new Batcher<string, User>(
		async (ids) => axiosInstance.post('users/batch', ids, { withCredentials: true }).then((res) => res.data),
		(results, id) => results.find((result) => result.id === id),
	);

	static checkPluginVersion = new Batcher<{ id: string; version: string }, { id: string; version: string }>(
		async (ids) => axiosInstance.post('plugins/check-version', ids, { withCredentials: true }).then((res) => res.data),
		(results, id) => results.find((result) => result.id === id.id),
	);

	static async process() {
		for (const batcher of Batcher.batchers) {
			await batcher.batch();
		}
	}

	private promises = new Map<
		T,
		{
			resolve: Parameters<ConstructorParameters<typeof Promise<R>>[0]>[0];
			reject: Parameters<ConstructorParameters<typeof Promise<R>>[0]>[1];
		}
	>();

	constructor(
		private readonly batchFn: (ids: T[]) => Promise<R[]>,
		private readonly extractor: (result: R[], id: T) => R | undefined,
	) {
		Batcher.batchers.push(this);
	}

	private async batch() {
		const copy = new Map(this.promises);
		this.promises.clear();

		if (copy.size === 0) {
			return;
		}

		const ids = Array.from(copy.keys());

		await this.batchFn(ids)
			.then((results) => {
				ids.forEach((id) => {
					const result = this.extractor(results, id);
					if (result) {
						const promise = copy.get(id);
						if (promise) {
							promise.resolve(result);
						}
					}
				});
			})
			.catch((error) => {
				ids.forEach((id) => {
					copy.get(id)?.reject(error);
				});
			})
			.finally(() => copy.clear());
	}

	get(id: T) {
		const promise = new Promise<R>((resolve, reject) => {
			this.promises.set(id, { resolve, reject });
		});

		return promise;
	}
}
