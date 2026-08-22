const definition_index: ReadonlyMap<string, Set<string>> = new Map([
	["/physics/senior high/01-motion.html", new Set(["参考系", "reference frame", "相对静止", "相对运动", "矢量", "vector", "标量", "scalar", "位矢", "position vector", "三角形法则", "矢量的减法", "位移", "displacement", "矢量的加法", "矢量的合成", "时间", "time", "矢量的数乘", "微元法", "速度", "velocity", "瞬时速度", "平均速度", "average velocity", "速率", "speed", "变化率", "平均值", "average"])]
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