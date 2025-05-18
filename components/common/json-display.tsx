export default function JsonDisplay({ json }: { json: any }) {
	return <pre className="text-wrap w-full">{JSON.stringify(json, null, '\t')}</pre>;
}
