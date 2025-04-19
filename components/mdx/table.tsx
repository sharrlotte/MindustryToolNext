import { ReactNode } from "react";


type TableProps = {
	header: ReactNode[];
	data: ReactNode[][];
};

export default function Table({ header, data }: TableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse border">
				<thead>
					<tr className="border-b">
						{header.map((cell, index) => (
							<th key={index} className="p-2 text-left font-medium border">
								{cell}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => (
						<tr key={rowIndex} className="border-b hover:bg-muted/50">
							{row.map((cell, cellIndex) => (
								<td key={cellIndex} className="p-2 border">
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
