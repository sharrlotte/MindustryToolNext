import { LOGIC_PERSISTENT_KEY } from '@/constant/constant';
import { LogicSave, LogicSaveData } from '@/types/index';

export function readLogicFromLocalStorage(): LogicSave {
	const data = localStorage.getItem(LOGIC_PERSISTENT_KEY);
	if (data) {
		return JSON.parse(data);
	}

	return {
		files: [],
	};
}

export function setCurrentLogicFile(name: string) {
	const saved = readLogicFromLocalStorage();
	saved.currentFile = name;
	localStorage.setItem(LOGIC_PERSISTENT_KEY, JSON.stringify(saved));
}

export function readLogicFromLocalStorageByName(name: string): LogicSaveData | undefined {
	const saved = readLogicFromLocalStorage();

	return saved.files.find((file) => file.name === name)?.data;
}

export function writeLogicToLocalStorage(name: string, data: LogicSaveData) {
	const saved = readLogicFromLocalStorage();

	const exists = saved.files.find((file) => file.name === name);

	if (exists) {
		exists.data = data;
	} else {
		saved.files.push({
			name,
			data,
		});
	}

	localStorage.setItem(LOGIC_PERSISTENT_KEY, JSON.stringify(saved));
}

export function renameLogic(newName: string) {
	const saved = readLogicFromLocalStorage();

	const oldName = saved.currentFile;

	saved.files = saved.files.map((file) => {
		if (file.name === oldName) file.name = newName;
		return file;
	});

	saved.currentFile = newName;

	localStorage.setItem(LOGIC_PERSISTENT_KEY, JSON.stringify(saved));
}

export function deleteFile(name: string) {
	const saved = readLogicFromLocalStorage();

	saved.files = saved.files.filter((file) => file.name !== name);

	if (saved.currentFile === name) {
		saved.currentFile = undefined;
	}

	localStorage.setItem(LOGIC_PERSISTENT_KEY, JSON.stringify(saved));
}

export function generateRandomName() {
	const save = readLogicFromLocalStorage();
	const names = save.files.map((file) => file.name);

	const title = 'logic-';

	let i = 0;
	while (i < 100000000) {
		const newName = title + i;
		if (names.includes(newName)) {
			i++;
			continue;
		} else {
			setCurrentLogicFile(newName);
			return newName;
		}
	}

	return null;
}
