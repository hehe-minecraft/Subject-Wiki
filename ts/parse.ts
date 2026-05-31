import { nodes } from "./nodes.js";

export namespace parse
{
	export namespace constant
	{
		export namespace math
		{
			export const parameter_count: ReadonlyMap<keyof MathMLElementTagNameMap, number> = new Map([
				["mfrac", 2],
				["mover", 2],
				["mroot", 2],
				["msqrt", 1],
				["msub", 2],
				["msubsup", 3],
				["msup", 2],
				["munder", 2],
				["munderover", 3],
			]);
			export const operator_replace: ReadonlyMap<RegExp | string, string> = new Map([
				["-", "−"],
				["*", "×"],
				[">>", "≫"],
				["<<", "≪"],
				[">>>", "⋙"],
				["<<<", "⋘"],
				["->", "→"],
				[">=", "≥"],
				["<=", "≤"],
				["\\^", "^"],
				["\\_", "_"],
				["\\\\", "\\"],
				["\\{", "{"],
				["\\}", "}"],
				["\\lfloor", "⌊"],
				["\\rfloor", "⌋"],
				["\\lceil", "⌈"],
				["\\rceil", "⌉"],
				["\\langle", "⟨"],
				["\\rangle", "⟩"],
				["\\|", "‖"],
				["\\mid", "|"],
				["\\nmid", "∤"],
				["\\pm", "±"],
				["\\mp", "∓"],
				["\\cdot", "·"],
				["\\times", "×"],
				["\\div", "÷"],
				["\\circ", "∘"],
				["\\bullet", "•"],
				["\\oplus", "⊕"],
				["\\ominus", "⊖"],
				["\\otimes", "⊗"],
				["\\oslash", "⊘"],
				["\\neq", "≠"],
				["\\leq", "≤"],
				["\\geq", "≥"],
				["\\gg", "≫"],
				["\\ll", "≪"],
				["\\ggg", "⋙"],
				["\\lll", "⋘"],
				["\\approx", "≈"],
				["\\propto", "∝"],
				["\\sim", "∼"],
				["\\equiv", "≡"],
				["\\cong", "≅"],
				["\\perp", "⊥"],
				["\\parallel", "∥"],
				["\\in", "∈"],
				["\\notin", "∉"],
				["\\cap", "∩"],
				["\\intersection", "∩"],
				["\\cup", "∪"],
				["\\union", "∪"],
				["\\subset", "⊂"],
				["\\supset", "⊃"],
				["\\subseteq", "⊆"],
				["\\supseteq", "⊇"],
				["\\subsetneqq", "⫋"],
				["\\supsetneqq", "⫌"],
				["\\land", "∧"],
				["\\lor", "∨"],
				["\\lnot", "¬"],
				["\\sum", "∑"],
				["\\prod", "∏"],
				["\\coprod", "∐"],
				["\\int", "∫"],
				["\\oint", "∮"],
				["\\iint", "∬"],
				["\\oiint", "∯"],
				["\\iiint", "∭"],
				["\\oiiint", "∰"],
				["\\bigcap", "⋂"],
				["\\bigintersection", "⋂"],
				["\\bigcup", "⋃"],
				["\\bigunion", "⋃"],
				["\\bigwedge", "⋀"],
				["\\bigand", "⋀"],
				["\\bigvee", "⋁"],
				["\\bigor", "⋁"],
				["\\bigodot", "⨀"],
				["\\leftarrow", "←"],
				["\\rightarrow", "→"],
				["\\leftrightarrow", "↔"],
				["\\uparrow", "↑"],
				["\\downarrow", "↓"],
				["\\updownarrow", "↕"],
				["\\Leftarrow", "⇐"],
				["\\Rightarrow", "⇒"],
				["\\Leftrightarrow", "⇔"],
				["\\Uparrow", "⇑"],
				["\\Downarrow", "⇓"],
				["\\Updownarrow", "⇕"],
				["\\vdots", "⋮"],
				["\\cdots", "⋯"],
				["\\ddots", "⋱"],
				["\\dagger", "†"],
				["\\ddagger", "‡"],
				["\\forall", "∀"],
				["\\exists", "∃"],
				["\\nabla", "∇"],
			]);
			export const identifier_replace: ReadonlyMap<RegExp | string, string> = new Map([
				["\\alpha", "α"],
				["\\beta", "β"],
				["\\gamma", "γ"],
				["\\delta", "δ"],
				["\\epsilon", "ϵ"],
				["\\zeta", "ζ"],
				["\\eta", "η"],
				["\\theta", "θ"],
				["\\iota", "ι"],
				["\\kappa", "κ"],
				["\\lambda", "λ"],
				["\\mu", "μ"],
				["\\nu", "ν"],
				["\\xi", "ξ"],
				["\\omicron", "ο"],
				["\\pi", "π"],
				["\\rho", "ρ"],
				["\\sigma", "σ"],
				["\\tau", "τ"],
				["\\upsilon", "υ"],
				["\\phi", "φ"],
				["\\chi", "χ"],
				["\\psi", "ψ"],
				["\\omega", "ω"],
				["\\Alpha", "Α"],
				["\\Beta", "Β"],
				["\\Gamma", "Γ"],
				["\\Delta", "Δ"],
				["\\Epsilon", "Ε"],
				["\\Zeta", "Ζ"],
				["\\Eta", "Η"],
				["\\Theta", "Θ"],
				["\\Iota", "Ι"],
				["\\Kappa", "Κ"],
				["\\Lambda", "Λ"],
				["\\Mu", "Μ"],
				["\\Nu", "Ν"],
				["\\Xi", "Ξ"],
				["\\Omicron", "Ο"],
				["\\Pi", "Π"],
				["\\Rho", "Ρ"],
				["\\Sigma", "Σ"],
				["\\Tau", "Τ"],
				["\\Upsilon", "Υ"],
				["\\Phi", "Φ"],
				["\\Chi", "Χ"],
				["\\Psi", "Ψ"],
				["\\Omega", "Ω"],
				["\\digamma", "ϝ"],
				["\\varepsilon", "ε"],
				["\\vartheta", "ϑ"],
				["\\varkappa", "ϰ"],
				["\\varpi", "ϖ"],
				["\\varrho", "ϱ"],
				["\\varsigma", "ς"],
				["\\varphi", "ϕ"],
				["\\infty", "∞"],
				["\\emptyset", "⌀"],
				["\\o", "⌀"],
				["\\diff", "d"],
				["\\partial", "∂"],
				["\\lim", "lim"],
				["\\sin", "sin"],
				["\\cos", "cos"],
				["\\tan", "tan"],
				["\\cot", "cot"],
				["\\sec", "sec"],
				["\\csc", "csc"],
				["\\sinh", "sinh"],
				["\\cosh", "cosh"],
				["\\tanh", "tanh"],
				["\\coth", "coth"],
				["\\sech", "sech"],
				["\\csch", "csch"],
				["\\arcsin", "arcsin"],
				["\\arccos", "arccos"],
				["\\arctan", "arctan"],
				["\\arccot", "arccot"],
				["\\arcsec", "arcsec"],
				["\\arccsc", "arccsc"],
				["\\arsinh", "arsinh"],
				["\\arcosh", "arcosh"],
				["\\artanh", "artanh"],
				["\\arcoth", "arcoth"],
				["\\arsech", "arsech"],
				["\\arcsch", "arcsch"],
				["\\ln", "ln"],
				["\\log", "log"],
				["\\lg", "lg"],
				["\\exp", "exp"],
				["\\det", "det"],
				["\\max", "max"],
				["\\min", "min"],
				["\\gcd", "gcd"],
				["\\lcm", "lcm"],
				["\\mod", "mod"],
				["\\card", "card"],
				["\\normalA", "A"],
				["\\normalB", "B"],
				["\\normalC", "C"],
				["\\normalD", "D"],
				["\\normalE", "E"],
				["\\normalF", "F"],
				["\\normalG", "G"],
				["\\normalH", "H"],
				["\\normalI", "I"],
				["\\normalJ", "J"],
				["\\normalK", "K"],
				["\\normalL", "L"],
				["\\normalM", "M"],
				["\\normalN", "N"],
				["\\normalO", "O"],
				["\\normalP", "P"],
				["\\normalQ", "Q"],
				["\\normalR", "R"],
				["\\normalS", "S"],
				["\\normalT", "T"],
				["\\normalU", "U"],
				["\\normalV", "V"],
				["\\normalW", "W"],
				["\\normalX", "X"],
				["\\normalY", "Y"],
				["\\normalZ", "Z"],
				["\\normala", "a"],
				["\\normalb", "b"],
				["\\normalc", "c"],
				["\\normald", "d"],
				["\\normale", "e"],
				["\\normalf", "f"],
				["\\normalg", "g"],
				["\\normalh", "h"],
				["\\normali", "i"],
				["\\normalj", "j"],
				["\\normalk", "k"],
				["\\normall", "l"],
				["\\normalm", "m"],
				["\\normaln", "n"],
				["\\normalo", "o"],
				["\\normalp", "p"],
				["\\normalq", "q"],
				["\\normalr", "r"],
				["\\normals", "s"],
				["\\normalt", "t"],
				["\\normalu", "u"],
				["\\normalv", "v"],
				["\\normalw", "w"],
				["\\normalx", "x"],
				["\\normaly", "y"],
				["\\normalz", "z"],
				["\\boldA", "𝐀"],
				["\\boldB", "𝐁"],
				["\\boldC", "𝐂"],
				["\\boldD", "𝐃"],
				["\\boldE", "𝐄"],
				["\\boldF", "𝐅"],
				["\\boldG", "𝐆"],
				["\\boldH", "𝐇"],
				["\\boldI", "𝐈"],
				["\\boldJ", "𝐉"],
				["\\boldK", "𝐊"],
				["\\boldL", "𝐋"],
				["\\boldM", "𝐌"],
				["\\boldN", "𝐍"],
				["\\boldO", "𝐎"],
				["\\boldP", "𝐏"],
				["\\boldQ", "𝐐"],
				["\\boldR", "𝐑"],
				["\\boldS", "𝐒"],
				["\\boldT", "𝐓"],
				["\\boldU", "𝐔"],
				["\\boldV", "𝐕"],
				["\\boldW", "𝐖"],
				["\\boldX", "𝐗"],
				["\\boldY", "𝐘"],
				["\\boldZ", "𝐙"],
				["\\bolda", "𝐚"],
				["\\boldb", "𝐛"],
				["\\boldc", "𝐜"],
				["\\boldd", "𝐝"],
				["\\bolde", "𝐞"],
				["\\boldf", "𝐟"],
				["\\boldg", "𝐠"],
				["\\boldh", "𝐡"],
				["\\boldi", "𝐢"],
				["\\boldj", "𝐣"],
				["\\boldk", "𝐤"],
				["\\boldl", "𝐥"],
				["\\boldm", "𝐦"],
				["\\boldn", "𝐧"],
				["\\boldo", "𝐨"],
				["\\boldp", "𝐩"],
				["\\boldq", "𝐪"],
				["\\boldr", "𝐫"],
				["\\bolds", "𝐬"],
				["\\boldt", "𝐭"],
				["\\boldu", "𝐮"],
				["\\boldv", "𝐯"],
				["\\boldw", "𝐰"],
				["\\boldx", "𝐱"],
				["\\boldy", "𝐲"],
				["\\boldz", "𝐳"],
				["\\bold0", "𝟎"],
				["\\bold1", "𝟏"],
				["\\bold2", "𝟐"],
				["\\bold3", "𝟑"],
				["\\bold4", "𝟒"],
				["\\bold5", "𝟓"],
				["\\bold6", "𝟔"],
				["\\bold7", "𝟕"],
				["\\bold8", "𝟖"],
				["\\bold9", "𝟗"],
				["\\boardA", "𝔸"],
				["\\boardB", "𝔹"],
				["\\boardC", "ℂ"],
				["\\boardD", "𝔻"],
				["\\boardE", "𝔼"],
				["\\boardF", "𝔽"],
				["\\boardG", "𝔾"],
				["\\boardH", "ℍ"],
				["\\boardI", "𝕀"],
				["\\boardJ", "𝕁"],
				["\\boardK", "𝕂"],
				["\\boardL", "𝕃"],
				["\\boardM", "𝕄"],
				["\\boardN", "ℕ"],
				["\\boardO", "𝕆"],
				["\\boardP", "ℙ"],
				["\\boardQ", "ℚ"],
				["\\boardR", "ℝ"],
				["\\boardS", "𝕊"],
				["\\boardT", "𝕋"],
				["\\boardU", "𝕌"],
				["\\boardV", "𝕍"],
				["\\boardW", "𝕎"],
				["\\boardX", "𝕏"],
				["\\boardY", "𝕐"],
				["\\boardZ", "ℤ"],
				["\\boarda", "𝕒"],
				["\\boardb", "𝕓"],
				["\\boardc", "𝕔"],
				["\\boardd", "𝕕"],
				["\\boarde", "𝕖"],
				["\\boardf", "𝕗"],
				["\\boardg", "𝕘"],
				["\\boardh", "𝕙"],
				["\\boardi", "𝕚"],
				["\\boardj", "𝕛"],
				["\\boardk", "𝕜"],
				["\\boardl", "𝕝"],
				["\\boardm", "𝕞"],
				["\\boardn", "𝕟"],
				["\\boardo", "𝕠"],
				["\\boardp", "𝕡"],
				["\\boardq", "𝕢"],
				["\\boardr", "𝕣"],
				["\\boards", "𝕤"],
				["\\boardt", "𝕥"],
				["\\boardu", "𝕦"],
				["\\boardv", "𝕧"],
				["\\boardw", "𝕨"],
				["\\boardx", "𝕩"],
				["\\boardy", "𝕪"],
				["\\boardz", "𝕫"],
				["\\board0", "𝟘"],
				["\\board1", "𝟙"],
				["\\board2", "𝟚"],
				["\\board3", "𝟛"],
				["\\board4", "𝟜"],
				["\\board5", "𝟝"],
				["\\board6", "𝟞"],
				["\\board7", "𝟟"],
				["\\board8", "𝟠"],
				["\\board9", "𝟡"],
				["\\calliA", "𝒜"],
				["\\calliB", "ℬ"],
				["\\calliC", "𝒞"],
				["\\calliD", "𝒟"],
				["\\calliE", "ℰ"],
				["\\calliF", "ℱ"],
				["\\calliG", "𝒢"],
				["\\calliH", "ℋ"],
				["\\calliI", "ℐ"],
				["\\calliJ", "𝒥"],
				["\\calliK", "𝒦"],
				["\\calliL", "ℒ"],
				["\\calliM", "ℳ"],
				["\\calliN", "𝒩"],
				["\\calliO", "𝒪"],
				["\\calliP", "𝒫"],
				["\\calliQ", "𝒬"],
				["\\calliR", "ℛ"],
				["\\calliS", "𝒮"],
				["\\calliT", "𝒯"],
				["\\calliU", "𝒰"],
				["\\calliV", "𝒱"],
				["\\calliW", "𝒲"],
				["\\calliX", "𝒳"],
				["\\calliY", "𝒴"],
				["\\calliZ", "𝒵"],
				["\\callia", "𝒶"],
				["\\callib", "𝒷"],
				["\\callic", "𝒸"],
				["\\callid", "𝒹"],
				["\\callie", "ℯ"],
				["\\callif", "𝒻"],
				["\\callig", "ℊ"],
				["\\callih", "𝒽"],
				["\\callii", "𝒾"],
				["\\callij", "𝒿"],
				["\\callik", "𝓀"],
				["\\callil", "𝓁"],
				["\\callim", "𝓂"],
				["\\callin", "𝓃"],
				["\\callio", "ℴ"],
				["\\callip", "𝓅"],
				["\\calliq", "𝓆"],
				["\\callir", "𝓇"],
				["\\callis", "𝓈"],
				["\\callit", "𝓉"],
				["\\calliu", "𝓊"],
				["\\calliv", "𝓋"],
				["\\calliw", "𝓌"],
				["\\callix", "𝓍"],
				["\\calliy", "𝓎"],
				["\\calliz", "𝓏"],
				["\\frakA", "𝔄"],
				["\\frakB", "𝔅"],
				["\\frakC", "ℭ"],
				["\\frakD", "𝔇"],
				["\\frakE", "𝔈"],
				["\\frakF", "𝔉"],
				["\\frakG", "𝔊"],
				["\\frakH", "ℌ"],
				["\\frakI", "ℑ"],
				["\\frakJ", "𝔍"],
				["\\frakK", "𝔎"],
				["\\frakL", "𝔏"],
				["\\frakM", "𝔐"],
				["\\frakN", "𝔑"],
				["\\frakO", "𝔒"],
				["\\frakP", "𝔓"],
				["\\frakQ", "𝔔"],
				["\\frakR", "ℜ"],
				["\\frakS", "𝔖"],
				["\\frakT", "𝔗"],
				["\\frakU", "𝔘"],
				["\\frakV", "𝔙"],
				["\\frakW", "𝔚"],
				["\\frakX", "𝔛"],
				["\\frakY", "𝔜"],
				["\\frakZ", "ℨ"],
				["\\fraka", "𝔞"],
				["\\frakb", "𝔟"],
				["\\frakc", "𝔠"],
				["\\frakd", "𝔡"],
				["\\frake", "𝔢"],
				["\\frakf", "𝔣"],
				["\\frakg", "𝔤"],
				["\\frakh", "𝔥"],
				["\\fraki", "𝔦"],
				["\\frakj", "𝔧"],
				["\\frakk", "𝔨"],
				["\\frakl", "𝔩"],
				["\\frakm", "𝔪"],
				["\\frakn", "𝔫"],
				["\\frako", "𝔬"],
				["\\frakp", "𝔭"],
				["\\frakq", "𝔮"],
				["\\frakr", "𝔯"],
				["\\fraks", "𝔰"],
				["\\frakt", "𝔱"],
				["\\fraku", "𝔲"],
				["\\frakv", "𝔳"],
				["\\frakw", "𝔴"],
				["\\frakx", "𝔵"],
				["\\fraky", "𝔶"],
				["\\frakz", "𝔷"],
			]);
			export const variant_normal_identifiers: ReadonlyArray<string> = [
				"\\normalA",
				"\\normalB",
				"\\normalC",
				"\\normalD",
				"\\normalE",
				"\\normalF",
				"\\normalG",
				"\\normalH",
				"\\normalI",
				"\\normalJ",
				"\\normalK",
				"\\normalL",
				"\\normalM",
				"\\normalN",
				"\\normalO",
				"\\normalP",
				"\\normalQ",
				"\\normalR",
				"\\normalS",
				"\\normalT",
				"\\normalU",
				"\\normalV",
				"\\normalW",
				"\\normalX",
				"\\normalY",
				"\\normalZ",
				"\\normala",
				"\\normalb",
				"\\normalc",
				"\\normald",
				"\\normale",
				"\\normalf",
				"\\normalg",
				"\\normalh",
				"\\normali",
				"\\normalj",
				"\\normalk",
				"\\normall",
				"\\normalm",
				"\\normaln",
				"\\normalo",
				"\\normalp",
				"\\normalq",
				"\\normalr",
				"\\normals",
				"\\normalt",
				"\\normalu",
				"\\normalv",
				"\\normalw",
				"\\normalx",
				"\\normaly",
				"\\normalz",
				"\\diff",
			];
			export const binary_operator: ReadonlyMap<string, keyof MathMLElementTagNameMap> = new Map([
				["^", "msup"],
				["^^", "mover"],
				["_", "msub"],
				["__", "munder"],
				["/", "mfrac"],
				["\\root", "mroot"]
			]);
			export const unary_operator: ReadonlyMap<string, keyof MathMLElementTagNameMap> = new Map([
				["\\sqrt", "msqrt"],
			]);
		}
	}
	export function* parse_inline(source: string): Generator<string | HTMLElement, void>
	{
		yield source;
	}
	function parse_chunk(source: string): (string | Node)[]
	{
		const lines = source.split("\n");
		const result_nodes: (string | Node)[] = [];
		for (const each_line of lines)
		{
			if (each_line.startsWith("MATH "))
			{
				result_nodes.push(parse_math(each_line.substring(5)));
			}
			else
			{
				result_nodes.push(...parse_inline(each_line));
				result_nodes.push(document.createElement("br"));
			}
		}
		const last_node = result_nodes[result_nodes.length - 1];
		if (last_node instanceof HTMLElement && last_node.tagName === "br")
		{
			result_nodes.pop();
		}
		return result_nodes;
	}
	export function* parse_source(source: string): Generator<Node, void>
	{
		let heading_id = 0;
		for (const each_chunk of source.split(/\n\s*\n/g))
		{
			if (each_chunk.startsWith("#"))
			{
				heading_id ++;
				const heading_level = Math.min(each_chunk.match(/#+/)![0].length + 1, 6);
				const heading = document.createElement(`h${heading_level}`);
				heading.id = `heading_${heading_id}`;
				heading.dataset.heading_level = heading_level.toString();
				heading.append(...parse_chunk(each_chunk.slice(heading_level - 1)));
				yield heading;
			}
			else
			{
				const paragraph = document.createElement("p");
				paragraph.append(...parse_chunk(each_chunk));
				yield paragraph;
			}
		}
	}
	export function parse_math(source: string): MathMLElement
	{
		interface element_group
		{
			elements: MathMLElement[];
			parent: MathMLElement;
		}
		const element: MathMLElement = nodes.math_element("math");
		const element_stack: element_group[] = [{ elements: [], parent: element }]; // The first entry should never be popped.
		for (const each_match of source.matchAll(/\\(?:matrix\{|[a-zA-Z0-9]+|[\\^_|{}])|\^{2}|_{2}|>{2,3}|<{2,3}|[<>]=|->|[^0-9\\]|\d+(?:\.\d+)?/g))
		{
			let each_symbol = each_match[0];
			const current_parent: MathMLElement = element_stack[element_stack.length - 1].parent;
			const current_elements: MathMLElement[] = element_stack[element_stack.length - 1].elements;
			if (each_symbol === " ") {}
			else if (each_symbol === "\\matrix{")
			{
				const new_element: MathMLElement = nodes.math_element("mtable");
				current_elements.push(new_element);
				element_stack.push({ elements: [], parent: new_element });
			}
			else if (each_symbol === "{")
			{
				let new_element: MathMLElement;
				if (current_parent.tagName === "mtr")
					new_element = nodes.math_element("mtd");
				else if (current_parent.tagName === "mtable")
					new_element = nodes.math_element("mtr");
				else
					new_element = nodes.math_element("mrow");
				current_elements.push(new_element);
				element_stack.push({ elements: [], parent: new_element });
			}
			else if (each_symbol === "}")
			{
				if (!["mrow", "mtable", "mtr", "mtd"].includes(current_parent.tagName))
					continue;
				nodes.attach(current_parent, current_elements);
				element_stack.pop();
			}
			else if (constant.math.unary_operator.has(each_symbol))
			{
				const new_element: MathMLElement = nodes.math_element(constant.math.unary_operator.get(each_symbol)!);
				current_elements.push(new_element);
				element_stack.push({ elements: [], parent: new_element });
			}
			else if (each_symbol === "\\choose")
			{
				const base_element: MathMLElement = current_elements.pop() ?? nodes.math_element("mrow");
				const left_bracket: MathMLElement = nodes.math_element("mo");
				left_bracket.textContent = "(";
				current_elements.push(left_bracket);
				const new_element: MathMLElement = nodes.math_element("mfrac");
				new_element.setAttribute("linethickness", "0");
				current_elements.push(new_element);
				element_stack.push({ elements: [base_element], parent: new_element });
				const right_bracket: MathMLElement = nodes.math_element("mo");
				right_bracket.textContent = ")";
				current_elements.push(right_bracket);
			}
			else if (constant.math.binary_operator.has(each_symbol))
			{
				const base_element: MathMLElement = current_elements.pop() ?? nodes.math_element("mrow");
				const new_element: MathMLElement = nodes.math_element(constant.math.binary_operator.get(each_symbol)!);
				current_elements.push(new_element);
				element_stack.push({ elements: [base_element], parent: new_element });
			}
			else if (constant.math.operator_replace.has(each_symbol))
			{
				const new_element: MathMLElement = nodes.math_element("mo");
				new_element.textContent = constant.math.operator_replace.get(each_symbol)!;
				current_elements.push(new_element);
			}
			else if (constant.math.identifier_replace.has(each_symbol))
			{
				const new_element: MathMLElement = nodes.math_element("mi");
				if (constant.math.variant_normal_identifiers.includes(each_symbol))
					new_element.setAttribute("mathvariant", "normal");
				new_element.textContent = constant.math.identifier_replace.get(each_symbol)!;
				current_elements.push(new_element);
			}
			else if (/^(?:[()\[\]⌈⌉⌊⌋⟨⟩|‖<>=,.+−×⋅])$/.test(each_symbol)) // operator
			{
				const new_element: MathMLElement = nodes.math_element("mo");
				new_element.textContent = each_symbol;
				current_elements.push(new_element);
			}
			else if (/^\d+(?:\.\d+)?$/.test(each_symbol)) // number
			{
				const new_element: MathMLElement = nodes.math_element("mn");
				new_element.textContent = each_symbol;
				current_elements.push(new_element);
			}
			else if (each_symbol.startsWith("\\"))
			{
				const new_element: MathMLElement = nodes.math_element("merror");
				const inner_text_element: MathMLElement = nodes.math_element("mtext");
				inner_text_element.textContent = each_symbol;
				new_element.appendChild(inner_text_element);
				current_elements.push(new_element);
			}
			else // indentifier
			{
				const new_element: MathMLElement = nodes.math_element("mi");
				new_element.textContent = each_symbol;
				current_elements.push(new_element);
			}
			let current_level: element_group = element_stack[element_stack.length - 1];
			while ((constant.math.parameter_count.get(current_level.parent.nodeName as keyof MathMLElementTagNameMap) ?? +Infinity) <= current_level.elements.length)
			{
				element_stack.pop();
				if (current_level.parent.nodeName !== "mroot")
				{
					nodes.attach(current_level.parent, current_level.elements);
				}
				else // mrow needs to reverse to support 3\root 2
				{
					nodes.attach(current_level.parent, current_level.elements.reverse());
				}
				current_level = element_stack[element_stack.length - 1];
			}
		}
		for (const each_element of element_stack[0].elements)
			element.appendChild(each_element);
		return element;
	}
}