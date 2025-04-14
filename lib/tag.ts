import { PRESET_LOCAL_STORAGE_NAME, PresetType } from '@/constant/constant';
import { TagPreset } from '@/types/index';

export function getTagPreset(type?: PresetType): TagPreset[] {
	const str = localStorage.getItem(PRESET_LOCAL_STORAGE_NAME);

	if (!str) {
		return [];
	}

	try {
		const value = JSON.parse(str) as TagPreset[];

		if (!Array.isArray(value)) {
			return [];
		}

		if (type === undefined) {
			return value;
		}

		return value.filter((value) => value.type === type);
	} catch (e) {
		return [];
	}
}

export function deleteTagPreset(name: string, type: PresetType) {
	const value = getTagPreset().filter((item) => item.name !== name || item.type !== type);

	return localStorage.setItem(PRESET_LOCAL_STORAGE_NAME, JSON.stringify(value));
}

export function addTagPreset(newPreset: TagPreset) {
	const preset = getTagPreset();

	const sameName = preset.find((item) => item.name === newPreset.name && item.type === newPreset.type);
	if (sameName) {
		sameName.tags = newPreset.tags;
	} else {
		preset.push(newPreset);
	}

	localStorage.setItem(PRESET_LOCAL_STORAGE_NAME, JSON.stringify(preset));
}
