const definition_index: ReadonlyMap<string, Set<string>> = new Map([
	["/math/statistics/random variable.html", new Set(["随机变量"])]
]);

export function get_index_position(definition_name: string): string | undefined
{
	for (const [file, definitions] of definition_index.entries())
	{
		if (definitions.has(definition_name))
		{
			return `${file}#${definition_name}`;
		}
	}
	return undefined;
}