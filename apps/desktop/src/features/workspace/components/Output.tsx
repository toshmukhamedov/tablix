import type { QueryOutput } from "@/commands/query";
import { QueryPreview } from "@/components/QueryPreview";

type Props = {
	outputs: QueryOutput[];
};
export const Output: React.FC<Props> = ({ outputs }) => {
	return (
		<div className="bg-[var(--mantine-color-dark-9)] h-full w-full px-2 py-1">
			<div className="scrollable flex max-h-full flex-col-reverse">
				{outputs.length > 0 ? (
					outputs.map((output, index) => (
						<div
							key={`${output.connectionId}${index}`}
							className="flex gap-1 items-center text-sm font-mono text-[var(--mantine-color-dark-2)] data-[error=true]:text-[var(--mantine-color-red-4)]"
							data-error={output.outputType === "Error"}
						>
							<p>[{new Date(output.time).toLocaleString()}]</p>
							<span className="opacity-80">
								<QueryPreview code={output.message} />
							</span>
						</div>
					))
				) : (
					<span className="text-sm font-mono text-[var(--mantine-color-dark-2)]">
						No queries have been executed yet
					</span>
				)}
			</div>
		</div>
	);
};
