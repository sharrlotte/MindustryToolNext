export default function JsonDisplay({ json }: { json: any }) {
	return <pre>{JSON.stringify(json, null, 2)}</pre>;
}
