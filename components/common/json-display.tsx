export default function JsonDisplay({ json }: { json: string }) {
	return <pre>{JSON.stringify(JSON.parse(json), null, 2)}</pre>;
}
