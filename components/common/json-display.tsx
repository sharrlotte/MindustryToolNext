export default function JsonDisplay({ json }: { json: any }) {
	if (typeof json === 'string') {
		return <pre className="text-wrap w-full">{json}</pre>;
	}

	return <pre className="text-wrap w-full">{JSON.stringify(json, null, '\t')}</pre>;
}
