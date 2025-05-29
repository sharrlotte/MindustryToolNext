type TextArea = {
	value: string;
	selectionStart?: number;
	selectionEnd?: number;
	focus: () => void;
	setSelectionRange: (start: number, end: number) => void;
};

export function insertAtCaret(input: TextArea | null, text: string, value: string) {
	if (!input) return text;

	const position = input.selectionStart === undefined ? input.value.length : input.selectionStart;

	const newPosition = position + value.length;
	input.focus();
	setTimeout(() => input.setSelectionRange(newPosition, newPosition));

	return text.substring(0, position) + value + text.substring(position);
}

export function wrapAtCaret(input: TextArea | null, text: string, before: string, after: string) {
	if (!input) return text;

	let start = input.selectionStart === undefined ? input.value.length : input.selectionStart;
	let end = input.selectionEnd === undefined ? input.value.length : input.selectionEnd;

	if (start > end) {
		[start, end] = [end, start];
	}

	if (start !== end) {
		input.focus();

		setTimeout(() => input.setSelectionRange(start + before.length, end + after.length));
		return text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);
	} else {
		const position = start;

		let newPosition = position + before.length;
		newPosition = newPosition > 0 ? Math.round(newPosition) : 0;
		input.focus();
		setTimeout(() => input.setSelectionRange(newPosition, newPosition));

		return text.substring(0, position) + before + after + text.substring(position);
	}
}
