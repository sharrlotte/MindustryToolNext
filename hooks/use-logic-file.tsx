import { useCallback } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { LOGIC_PERSISTENT_KEY } from '@/constant/constant';
import { LogicSave, LogicSaveData } from '@/types/index';

export default function useLogicFile() {
	const [saved, setSaved] = useLocalStorage<LogicSave>(LOGIC_PERSISTENT_KEY, {
		files: [],
	});

	const setCurrentLogicFile = useCallback(
		(name: string) => {
			setSaved((prev) => ({ ...prev, currentFile: name }));
		},
		[setSaved],
	);

	const readLogicFromLocalStorageByName = useCallback(
		(name: string): LogicSaveData | undefined => {
			return saved.files.find((file) => file.name === name)?.data;
		},
		[saved.files],
	);

	const writeLogicToLocalStorage = useCallback(
		(name: string, data: LogicSaveData) => {
			setSaved((prev) => {
				const exists = prev.files.find((file) => file.name === name);
				if (exists) {
					return {
						...prev,
						files: prev.files.map((file) => (file.name === name ? { ...file, data } : file)),
					};
				}
				return {
					...prev,
					files: [...prev.files, { name, data }],
				};
			});
		},
		[setSaved],
	);

	const renameLogic = useCallback(
		(newName: string) => {
			setSaved((prev) => ({
				...prev,
				currentFile: newName,
				files: prev.files.map((file) => (file.name === prev.currentFile ? { ...file, name: newName } : file)),
			}));
		},
		[setSaved],
	);

	const deleteFile = useCallback(
		(name: string) => {
			setSaved((prev) => ({
				...prev,
				currentFile: prev.currentFile === name ? undefined : prev.currentFile,
				files: prev.files.filter((file) => file.name !== name),
			}));
		},
		[setSaved],
	);

	const generateRandomName = useCallback(() => {
		const names = saved.files.map((file) => file.name);
		const title = 'logic-';

		let i = 0;
		while (i < 100000000) {
			const newName = title + i;
			if (!names.includes(newName)) {
				setCurrentLogicFile(newName);
				return newName;
			}
			i++;
		}
		return null;
	}, [saved.files, setCurrentLogicFile]);

	return {
		saved,
		setCurrentLogicFile,
		readLogicFromLocalStorageByName,
		writeLogicToLocalStorage,
		renameLogic,
		deleteFile,
		generateRandomName,
	};
}
