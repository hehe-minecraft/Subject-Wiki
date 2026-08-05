const definition_index: ReadonlyMap<string, Set<string>> = new Map([
	["/physics/senior high/01-motion.html", new Set(["参考系", "reference frame", "相对静止", "相对运动", "矢量", "vector", "标量", "scalar", "位矢", "position vector"])]
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