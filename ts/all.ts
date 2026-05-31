import { parse } from "./parse.js";

window.addEventListener("DOMContentLoaded", () => {
	const navigation_bar = document.querySelector("nav>ol:empty") as HTMLOListElement | undefined;
	const nav_list_stack: HTMLElement[] = navigation_bar ? [navigation_bar] : [];
	const nav_item_stack: HTMLElement[] = [];
	for (const each_element of document.querySelectorAll("math[data-type=source]"))
	{
		each_element.replaceWith(parse.parse_math(each_element.textContent ?? ""));
	}
	const main_source = document.querySelector("main[data-type=source]") as HTMLElement;
	delete main_source.dataset.type;
	const source_with_tabs = main_source.textContent ?? "";
	main_source.innerHTML = "";
	const tab_count = source_with_tabs.match(/^\s*/)![0].length - 1;
	const source = source_with_tabs.replaceAll(new RegExp(`\n[\r\t\f\v ]{0,${tab_count}}`, "g"), "\n").slice(1);
	for (const each_parse_result of parse.parse_source(source))
	{
		main_source.appendChild(each_parse_result);
		if (each_parse_result instanceof HTMLHeadingElement && navigation_bar !== undefined)
		{
			let nav_indent: number = Number(each_parse_result.dataset.heading_level) - 2;
			while (nav_indent < nav_list_stack.length - 1)
				nav_list_stack.pop();
			while (nav_indent < nav_item_stack.length - 1)
				nav_item_stack.pop();
			if (nav_indent > nav_list_stack.length)
				nav_indent = nav_list_stack.length;
			if (nav_indent === nav_list_stack.length)
			{
				const new_list: HTMLElement = document.createElement("ol");
				nav_list_stack.push(new_list);
				if (nav_indent > 0)
					nav_item_stack[nav_item_stack.length - 1].appendChild(new_list);
			}
			const nav_item: HTMLElement = document.createElement("li");
			nav_list_stack[nav_list_stack.length - 1].appendChild(nav_item);
			nav_item_stack.push(nav_item);
			const nav_link: HTMLAnchorElement = document.createElement("a");
			nav_link.href = `#${each_parse_result.id}`;
			for (const each_heading_child of each_parse_result.childNodes)
				nav_link.appendChild(each_heading_child.cloneNode(true));
			nav_item.appendChild(nav_link);
		}
	}
});