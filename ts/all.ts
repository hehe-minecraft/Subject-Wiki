import {nodes} from "./nodes.js"

export namespace parse_source
{
	export namespace environment
	{
		export let figure: string = "";
	}
	export namespace constant
	{
		export const paragraph_prefixes: ReadonlyMap<RegExp, string> = new Map([
			[/^NOTE /, "notice"],
			[/^WARN /, "warning"],
			[/^DEF /, "definition"]
		]);
		export enum chunk_type
		{
			Paragraph,
			Comment,
			Heading,
			Tree,
			Interval,
			Figure,
			Code,
			Math,
			Table,
			FunctionIO
		};
		export interface chunk_type_restrict
		{
			readonly before?: RegExp; // undefined is considered as no restriction
			readonly includes?: RegExp; // undefined is considered as no restriction
			readonly after?: RegExp; // undefined is considered as no restriction
			readonly concat?: boolean; // undefined is considered as false
		}
		export const chunk_type_restricts: ReadonlyMap<chunk_type, chunk_type_restrict> = new Map([
			[chunk_type.Heading, { includes: /^#+/ }],
			[chunk_type.Tree, { includes: /^ *- /, concat: true }],
			[chunk_type.Interval, { includes: /^===$/ }],
			[chunk_type.Code, { before: /^```/, after: /^```$/ }],
			[chunk_type.Figure, { includes: /^FIGURE / }],
			[chunk_type.Math, { includes: /^MATH / }],
			[chunk_type.Comment, { includes: /^([ \t]*|<!-- .+ -->)$/ }],
			[chunk_type.Table, { before: /^TABLE$/, after: /^END$/ }],
			[chunk_type.FunctionIO, { before: /^FUNCTIONIO$/, includes: /^[IO] |^$/, after: /^END$/ }],
			[chunk_type.Paragraph,  {}]
		]);
		export enum area_type
		{
			// All the parameter 0 are contents except FigureReference.
			Unknown,
			Content,
			Link,
			LinkBlank,
			// Parameter 1 : Link href (only accept the first value, must be a text)
			Term,
			// The same to Link (above).
			TermMeaning,
			Code,
			// Parameter 1 : Term meaning content (only accept the first value, must be a text)
			KeyboardInput,
			FigureReference,
			// Parameter 0 : Figure id (only accept the first value, must be a text)
			Math
			// Parameter 0 : Math content (only accept the first value, must be a text)
		}
		export const area_with_content: ReadonlyMap<area_type, keyof HTMLElementTagNameMap> = new Map([
			[area_type.Link, "a"],
			[area_type.LinkBlank, "a"],
			[area_type.Term, "dfn"],
			[area_type.TermMeaning, "dfn"],
			[area_type.Code, "code"],
			[area_type.KeyboardInput, "kbd"]
		]);
		export const math_parameter_count: ReadonlyMap<keyof MathMLElementTagNameMap, number> = new Map([
			["mfrac", 2],
			["mover", 2],
			["mroot", 2],
			["msqrt", 1],
			["msub", 2],
			["msubsup", 3],
			["msup", 2],
			["munder", 2],
			["munderover", 3]
		]);
		export const math_operator_replace: ReadonlyMap<RegExp | string, string> = new Map([
			["-", "−"],
			["*", "×"],
			[">>", "≫"],
			["<<", "≪"],
			[">>>", "⋙"],
			["<<<", "⋘"],
			["->", "→"],
			[">=", "≥"],
			["<=", "≤"],
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
			["\\ddagger", "‡"]
		]);
		export const math_identifier_replace: ReadonlyMap<RegExp | string, string> = new Map([
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
			["\\forall", "∀"],
			["\\exists", "∃"],
			["\\nabla", "∇"],
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
			["\\frakz", "𝔷"]
		]);
		export const math_variant_normal_identifiers: ReadonlyArray<string> = [
			"\\Alpha",
			"\\Beta",
			"\\Gamma",
			"\\Delta",
			"\\Epsilon",
			"\\Zeta",
			"\\Eta",
			"\\Theta",
			"\\Iota",
			"\\Kappa",
			"\\Lambda",
			"\\Mu",
			"\\Nu",
			"\\Xi",
			"\\Omicron",
			"\\Pi",
			"\\Rho",
			"\\Sigma",
			"\\Tau",
			"\\Upsilon",
			"\\Phi",
			"\\Chi",
			"\\Psi",
			"\\Omega",
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
			"\\diff"
		];
		export const math_binary_operator: ReadonlyMap<string, keyof MathMLElementTagNameMap> = new Map([
		    ["^", "msup"],
			["^^", "mover"],
			["_", "msub"],
			["__", "munder"],
			["/", "mfrac"],
			["\\root", "mroot"]
		]);
		export const math_unary_operator: ReadonlyMap<string, keyof MathMLElementTagNameMap> = new Map([
			["\\sqrt", "msqrt"],
			["\\cell", "mtd"],
			["\\row", "mtr"]
		]);
	}
	/* --- SOURCE Language Explanation ---
	In this language, symbols are mainly capital letters.
	1.	Blocks
		Each block group is called a "chunk" in the file.
		Normally each block has only one line, but some has multiple lines.
		Most multi-line blocks are closed by "END".
		a.	Normal Text
			We use a single line to create a text (exactly <p>).
			We can add some symbols before it, like "NOTE", "WARN", "DEF" (for definition).
			e.g. NOTE This is a note
			     ^^^^ ^^^^^^^^^^^^^^
			    symbol  expression
		b.	Headings
			We use "#" to define headings. The more "#", the smaller heading.
			The smallest heading is <h6>.
			e.g. "#" refers to <h2>, "#####" and "######" refer to <h6>.
		c.	List
			We can't define an unordered list.
			1)	Ordered List
				We use "-" to define an ordered list.
				Adding space before the "-" makes the entry smaller.
				e.g.
				- Caption 1
				  - SubCaption
				- Caption 2
				will produce
				1. Caption 1
				   1. Subcaption
				2. Caption 2
		d.	Interval
			Intervals are defined as "===".
		e.	Figure
			We can use "FIGURE id" to insert a figure.
			The source <figure> with the id should be also in the file.
			Figures are numbered automatically.
			See "3. Environment".
		f.	Comment
			We can use "<!-- comment -->" to create a comment.
			Empty lines are also regarded as comments.
		g.	Code
			Cover a piece of code with "```" to create a code block.
			We can add a language name right after (with no spaces) the leading "```" to specify the language.
			No other block will be parsed in the code block.
			* Language is not supported yet. *
			e.g.
			```c++
			std::cout << "This is a code" << std::endl;
			```
		h.	Math
			We can use "MATH code" to create a math block.
			The syntax is similar to LaTeX. The differences are listed below.
			1)	We use "/" instead of "\over".
			2)	Removed "\frac".
			3)	We use "^^" and "__" to create "mover" and "munder" respectively.
			4)	We can also use these abbreviations.
				a)	"\o" -> "\varnothing"
				b)	"->" -> "\rightarrow"
				c)	">>" -> "\gg"
				d)	"<<" -> "\ll"
				e)	">>>" -> "\ggg"
				f)	"<<<" -> "\lll"
				g)	">=" -> "\geq"
				h)	"<=" -> "\leq"
			5)	"\normal", "\bold", "\calli", "\board" and "\frak" followed by a letter refer to "\mathrm", "\mathbf", "\mathcal", "\mathbb" and "\mathfrak" respectively.
			6)	Add more trigonometric functions. e.g. "\arsinh", "\csch", "\arccsc".
			7)	We use "3 \root 2" instead of "\sqrt[3]{2}".
			8)	"\\" does not refer to a new line.
			9)	We use "\matrix" to create an matrix.
				e.g. |\matrix{{{1}{2}}{{3}{4}}}| will produce
				| 1  2 |
				| 3  4 |
		i.	Table
			This is a multi-line block which starts with "TABLE" and ends with "END" (necessary).
			Each normal table cell should be surrounded by "|:" and ":|".
			Header cells should be surrounded by "|::" and "::|".
			"|" can be shared between cells.
			After the cell body and ":"s, you can add ">number" to let it span over "number + 1" columns.
			Also, you can add "vnumber" to let it span over "number + 1" rows.
			The numbers must not be negative.
			">" and "v" can be used at the same time, with ">" before "v".
			e.g.
			TABLE
			|::Header 1::|::Header 2::|::Header 3::|
			|:Cell 1:|   |:Cell 2:>0v0|:Rowspan:v1|
			|:Colspan:>1|
			|:Both:>1v1|              |:Cell 3:|
			                          |:Cell 4:|
			END
			will produce
			+----------+----------+----------+
			| Header 1 | Header 2 | Header 3 |
			+----------+----------+----------+
			| Cell 1   | Cell 2   | Rowspan  |
			+----------+----------+          |
			| Colspan             |          |
			+---------------------+----------+
			| Both                | Cell 3   |
			|                     +----------+
			|                     | Cell 4   |
			+---------------------+----------|
			where "Header 1" to "Header 3" are header cells (th), and the rest are normal cells (td).
		j.	Function io
			This is a multi-line block which starts with "FUNCTIONIO" and ends with "END" (unnecessary).
			"END" is unnecessary if the next line doesn't start with "I" or "O".
			Lines starting with "I" are inputs, which shows on the left, while lines starting with "O" are outputs, which shows on the right.
			Inputs and outputs can be mixed up.
			e.g.
			FUNCTIONIO
			I input 1
			I input 2
			O output 1
			I input 3
			O output 2
			END
			will produce
			+---------+  +----------+
			| input 1 |  | output 1 |
			| input 2 |  | output 2 |
			| input 3 |  +----------+
			+---------+
	2.	Inlines
		Each inline group is called an "area" in the file.
		Inline symbols are surrounded by "[]".
		a.	Link
			We can use [name TO target] to create a link.
			Add " BLANK" after "TO" to make the link "_blank".
			e.g. Go to [Github TO BLANK github.com]
		b.	Term
			We can use [NOUN term] to create a term.
			The [NOUN term AS description] is more commonly used.
		c.	Code
			We can use [CODE code] to create a piece of code.
			This is different from the code block, for this is parsed as "code" element while the code block is parsed as "pre".
		d.	Keyboard Input
			We can use [KEY key] to create a keyboard input.
		e.	Figure Reference
			We can use [FIGURE figure] to refer to a figure.
			The figure must exist in a block before it.
		f.	Math
			We can use [MATH code] to create a math block.
			See "h. Math" in "2. Blocks".
	3.	Environment
		You should define all your environment settings in a variable called "parse_source.environment".
		a.	If you are using figures in2 your codes, you should define the attribute "figure" (string), with the number placeholder as "$".
			e.g. "Figure $" will be replaced into "Figure 1", "Figure 2", etc.
	*/
	interface Chunk
	{
		content: string;
		type: constant.chunk_type;
	}
	export class Parser
	{
		public source: string;
		public target?: HTMLElement;
		public target_nav?: HTMLElement;
		private figures: Array<HTMLElement>;
		constructor()
		{
			this.source = "";
			this.figures = [];
		}
		public parse(): boolean
		{
			// Part 1 - Detect errors
			if (this.target === undefined)
				return false;
			// Part 2 - Divide chunks
			const chunks: Chunk[] = Parser.get_chunks(this.source);
			// Part 3 - Parse chunks
			const parse_results: [Chunk, HTMLElement][] = [];
			for (const each_chunk of chunks)
			{
				const chunk_result = this.parse_chunk(each_chunk);
				if (chunk_result !== undefined)
					parse_results.push([each_chunk, chunk_result]);
			}
			// Part 4 - Deploy chunks
			this.target.innerHTML = "";
			const section_stack: HTMLElement[] = [this.target];
			const nav_list_stack: HTMLElement[] = this.target_nav ? [this.target_nav] : [];
			const nav_item_stack: HTMLElement[] = [];
			for (const [each_chunk, each_result] of parse_results)
			{
				if (each_chunk.type === constant.chunk_type.Heading)
				{
					// Step 1 - Create and append to section.
					const heading_level: number = each_chunk.content.match(/^#+/)?.[0].length ?? 1;
					while (section_stack.length > heading_level)
						section_stack.pop();
					while (section_stack.length <= heading_level)
					{
						const new_section: HTMLElement = document.createElement("section");
						if (section_stack.length === 1)
							new_section.id = each_chunk.content.replace(/^#+/, "");
						else
							new_section.id = `${section_stack[section_stack.length - 1].id}-${each_chunk.content.replace(/^#+/, "")}`;
						section_stack[section_stack.length - 1].appendChild(new_section);
						section_stack.push(new_section);
					}
					// Step 2 - Add to nav.
					if (this.target_nav !== undefined)
					{
						let nav_indent: number = heading_level - 1;
						while (nav_indent < nav_list_stack.length - 1)
							nav_list_stack.pop();
						while (nav_indent < nav_item_stack.length - 1)
							nav_item_stack.pop();
						if (nav_indent > nav_list_stack.length)
							nav_indent = nav_list_stack.length;
						if (nav_indent === nav_list_stack.length)
						{
							const new_list: HTMLElement = document.createElement("ol");
							nav_list_stack.push(new_list)
							if (nav_indent > 0)
								nav_item_stack[nav_item_stack.length - 1].appendChild(new_list);
						}
						const nav_item: HTMLElement = document.createElement("li");
						nav_list_stack[nav_list_stack.length - 1].appendChild(nav_item);
						nav_item_stack.push(nav_item);
						const nav_link: HTMLAnchorElement = document.createElement("a");
						nav_link.href = `#${section_stack[section_stack.length - 1].id}`;
						nav_link.innerText = each_result.innerText;
						nav_item.appendChild(nav_link);
					}
				}
				section_stack[section_stack.length - 1].appendChild(each_result);
			}
			return true;
		}
		private static get_chunks(source: string): Chunk[]
		{
			const lines: string[] = source.split(/\n/);
			const chunks: Chunk[] = [];
			let current_chunk_type: constant.chunk_type | undefined = undefined;
			for (const each_line of lines)
			{
				if (current_chunk_type !== undefined)
				{
					const current_chunk_restrict: constant.chunk_type_restrict = constant.chunk_type_restricts.get(current_chunk_type)!;
					if (current_chunk_restrict.after?.test(each_line) ?? false)
					{
						chunks[chunks.length - 1].content += "\n" + each_line;
						current_chunk_type = undefined;
						continue;
					}
					else if (current_chunk_restrict.includes?.test(each_line) ?? true)
					{
						chunks[chunks.length - 1].content += "\n" + each_line;
						continue;
					}
					else
					{
						current_chunk_type = undefined;
					}
				}
				for (const [each_chunk_type, each_chunk_restrict] of constant.chunk_type_restricts)
				{
					if (each_chunk_restrict.before?.test(each_line) ?? false)
					{
						chunks.push({ type: each_chunk_type, content: each_line });
						current_chunk_type = each_chunk_type;
						break;
					}
					else if (each_chunk_restrict.before !== undefined)
					{
						continue;
					}
					if ((each_chunk_restrict.includes?.test(each_line) ?? true))
					{
						if ((chunks[chunks.length - 1]?.type === each_chunk_type && each_chunk_restrict.concat === true) ?? false)
							chunks[chunks.length - 1].content += "\n" + each_line;
						else
							chunks.push({ type: each_chunk_type, content: each_line });
						break;
					}
				}
			}
			return chunks;
		}
		private parse_chunk(chunk: Chunk): HTMLElement | undefined
		{
			switch (chunk.type)
			{
				case constant.chunk_type.Paragraph:
					let paragraph_content: string = chunk.content;
					const paragraph_element: HTMLElement = document.createElement("p");
					for (const [each_regex, each_class] of constant.paragraph_prefixes)
					{
						if (each_regex.test(paragraph_content))
						{
							paragraph_content = paragraph_content.replace(each_regex, "");
							paragraph_element.classList.add(each_class);
							break;
						}
					}
					nodes.attach(paragraph_element, this.parse_inline(paragraph_content));
					return paragraph_element;
				case constant.chunk_type.Heading:
					const heading_level = chunk.content.match(/^#+/)?.[0].length ?? 1;
					const heading_element: HTMLElement = document.createElement(`h${heading_level + 1 > 6 ? 6 : heading_level + 1}`); // h1 is used at the top of the document.
					nodes.attach(heading_element, this.parse_inline(chunk.content.replace(/^#+/, "")));
					return heading_element;
				case constant.chunk_type.Tree:
					const tree_lines: string[] = chunk.content.split(/\n/);
					const list_stack: HTMLElement[] = [];
					const element_stack: HTMLElement[] = [];
					for (const each_line of tree_lines)
					{
						let tree_indent: number = each_line.match(/^ */)![0].length;
						while (tree_indent < list_stack.length - 1)
							list_stack.pop();
						while (tree_indent < element_stack.length - 1)
							element_stack.pop();
						if (tree_indent > list_stack.length)
							tree_indent = list_stack.length;
						if (tree_indent === list_stack.length)
						{
							const new_list: HTMLElement = document.createElement("ol");
							list_stack.push(new_list);
							if (tree_indent > 0)
								element_stack[element_stack.length - 1].appendChild(new_list);
						}
						const list_item: HTMLElement = document.createElement("li");
						list_stack[list_stack.length - 1].appendChild(list_item);
						element_stack.push(list_item);
						nodes.attach(list_item, this.parse_inline(each_line.replace(/^ *- /, "")));
					}
					list_stack[0]?.classList.add("tree");
					return list_stack[0];
				case constant.chunk_type.Code:
					const pre_content: string = chunk.content.replace(/^```[^\n]*|```$/g, "");
					const pre_language: string = chunk.content.match(/^```([^\n]*)/)![1];
					return Parser.parse_pre(pre_content, pre_language);
				case constant.chunk_type.Figure:
					const figure_id: string = chunk.content.replace(/^FIGURE /, "");
					const original_figure: HTMLElement | null = document.getElementById(figure_id);
					if (original_figure === null || original_figure.tagName !== "FIGURE")
						return undefined;
					if (this.figures.indexOf(original_figure) === -1)
						this.figures.push(original_figure);
					const figure_display: HTMLElement = original_figure.cloneNode(true) as HTMLElement;
					figure_display.removeAttribute("id");
					const figure_caption: HTMLElement | null = figure_display.querySelector("figcaption");
					const figure_number: number = this.figures.indexOf(original_figure) + 1;
					if (figure_caption !== null)
						figure_caption.textContent = environment.figure.replace(/\$/g, figure_number.toString()) + figure_caption.innerText;
					return figure_display;
				case constant.chunk_type.Interval:
					return document.createElement("hr");
				case constant.chunk_type.Math:
					return Parser.parse_math(chunk.content.replace(/^MATH /, ""));
				case constant.chunk_type.Table:
					const table_element: HTMLElement = document.createElement("table");
					for (const each_line of chunk.content.replace(/^TABLE\n|\nEND$/g, "").split(/\n/))
					{
						const table_row: HTMLElement = document.createElement("tr");
						for (const each_cell_match of each_line.matchAll(/(?<=\|)(?<colons>:{1,2})(?<content>.*?)\k<colons>(?<colspan>>\d+?)?(?<rowspan>v\d+?)?(?=\|)/g))
						{
							const table_cell: HTMLTableCellElement = document.createElement(each_cell_match.groups!.colons === "::" ? "th" : "td");
							if (each_cell_match.groups!.colspan !== undefined)
								table_cell.colSpan = parseInt(each_cell_match.groups!.colspan.match(/\d+/)![0]) + 1;
							if (each_cell_match.groups!.rowspan !== undefined)
								table_cell.rowSpan = parseInt(each_cell_match.groups!.rowspan.match(/\d+/)![0]) + 1;
							nodes.attach(table_cell, this.parse_inline(each_cell_match.groups!.content));
							table_row.appendChild(table_cell);
						}
						table_element.appendChild(table_row);
					}
					return table_element;
				case constant.chunk_type.FunctionIO:
					const io_element: HTMLDivElement = document.createElement("div");
					const input_element: HTMLDivElement = document.createElement("div");
					const output_element: HTMLDivElement = document.createElement("div");
					io_element.classList.add("io");
					input_element.classList.add("input");
					output_element.classList.add("output");
					nodes.attach(io_element, [input_element, output_element]);
					for (const each_line of chunk.content.split("\n"))
					{
						if (each_line === "FUNCTIONIO" || each_line === "END" || each_line === "")
							continue;
						const line_element = document.createElement("p");
						nodes.attach(line_element, this.parse_inline(each_line.slice(2)));
						if (each_line.startsWith("I"))
							input_element.appendChild(line_element);
						else // starts with O
							output_element.appendChild(line_element);
					}
					return io_element;
			}
		}
		private parse_inline(source: string): Iterable<Node>
		{
			// Part 1 - Divide areas (remove spaces but keep brackets)
			const areas: string[] = source.match(/([\[\]]|[^\[\] ]+)/g) ?? new Array();
			// Part 2 - Parse areas
			interface keyword_entry
			{
				type: constant.area_type,
				parameters: nodes.NodeGroup[]
				// The first dimension is the index of the parameter.
				// The second dimension is the nodes of the parameter.
			};
			const default_keyword: keyword_entry = {type: constant.area_type.Content, parameters: [new nodes.NodeGroup()]};
			const keyword_stack: keyword_entry[] = [Object.assign({}, default_keyword)]; // The first entry should never be popped.
			for (const each_area of areas)
			{
				if (each_area === "[")
				{
					keyword_stack.push({type: constant.area_type.Unknown, parameters: [new nodes.NodeGroup()]});
				}
				else if (each_area === "]")
				{
					if (keyword_stack.length === 1)
					{
						keyword_stack[0].parameters[0].push(document.createTextNode("]"));
						continue;
					}
					const current_keyword: keyword_entry = keyword_stack.pop()!;
					const last_keyword: keyword_entry = keyword_stack[keyword_stack.length - 1]!;
					const last_parameter: Node[] = last_keyword.parameters[last_keyword.parameters.length - 1];
					if (constant.area_with_content.has(current_keyword.type))
					{
						const new_node: HTMLElement = document.createElement(constant.area_with_content.get(current_keyword.type)!);
						nodes.attach(new_node, current_keyword.parameters[0]);
						last_parameter.push(new_node);
						switch (current_keyword.type)
						{
							case constant.area_type.LinkBlank:
								(new_node as HTMLAnchorElement).target = "_blank";
							case constant.area_type.Link:
								(new_node as HTMLAnchorElement).href = current_keyword.parameters[1][0]?.textContent ?? "";
								break;
							case constant.area_type.TermMeaning:
								new_node.title = current_keyword.parameters[1][0]?.textContent ?? "";
								break;
						}
					}
					else if (current_keyword.type === constant.area_type.Unknown)
					{
						last_parameter.push(document.createTextNode("["));
						last_parameter.push(...current_keyword.parameters[0]);
						last_parameter.push(document.createTextNode("]"));
					}
					else if (current_keyword.type === constant.area_type.FigureReference)
					{
						if (current_keyword.parameters[0][0] === undefined)
							continue;
						let figure_number: number = 0;
						for (const [each_figure_number, each_figure] of this.figures.entries())
						{
							if (each_figure.id === current_keyword.parameters[0][0].textContent)
							{
								figure_number = each_figure_number + 1;
								break;
							}
						}
						const new_element_figure_reference: Text = document.createTextNode(environment.figure.replace(/\$/g, figure_number.toString()));
						last_parameter.push(new_element_figure_reference);
					}
					else if (current_keyword.type === constant.area_type.Math)
					{
						if (current_keyword.parameters[0][0] === undefined)
							continue;
						const new_element = Parser.parse_math(current_keyword.parameters[0][0].textContent!);
						new_element.setAttribute("inline", "");
						last_parameter.push(new_element);
					}
				}
				else
				{
					const last_keyword: keyword_entry = keyword_stack[keyword_stack.length - 1];
					if (each_area === "TO" && last_keyword.type === constant.area_type.Unknown)
					{
						last_keyword.type = constant.area_type.Link;
						last_keyword.parameters.push(new nodes.NodeGroup());
					}
					else if (each_area === "BLANK" && last_keyword.type === constant.area_type.Link)
					{
						last_keyword.type = constant.area_type.LinkBlank;
					}
					else if (each_area === "NOUN" && last_keyword.type === constant.area_type.Unknown)
					{
						last_keyword.type = constant.area_type.Term;
					}
					else if (each_area === "AS" && last_keyword.type === constant.area_type.Term)
					{
						last_keyword.type = constant.area_type.TermMeaning;
						last_keyword.parameters.push(new nodes.NodeGroup());
					}
					else if (each_area === "CODE" && last_keyword.type === constant.area_type.Unknown)
					{
						last_keyword.type = constant.area_type.Code;
					}
					else if (each_area === "KEY" && last_keyword.type === constant.area_type.Unknown)
					{
						last_keyword.type = constant.area_type.KeyboardInput;
					}
					else if (each_area === "FIGURE" && last_keyword.type === constant.area_type.Unknown)
					{
						last_keyword.type = constant.area_type.FigureReference;
					}
					else if (each_area === "MATH" && last_keyword.type === constant.area_type.Unknown)
					{
						last_keyword.type = constant.area_type.Math;
					}
					else
					{
						const last_parameter: Node[] = last_keyword.parameters[last_keyword.parameters.length - 1];
						if (last_parameter[last_parameter.length - 1] instanceof Text)
							last_parameter[last_parameter.length - 1].textContent += " " + each_area;
						else
							last_parameter.push(document.createTextNode(each_area));
					}
				}
			}
			while (keyword_stack.length > 1)
			{
				const current_keyword: keyword_entry = keyword_stack.pop()!;
				const last_keyword: keyword_entry = keyword_stack[keyword_stack.length - 1];
				const last_parameter: Node[] = last_keyword.parameters[last_keyword.parameters.length - 1];
				last_parameter.push(document.createTextNode("["));
				last_parameter.push(...current_keyword.parameters[0]);
			}
			return keyword_stack[0].parameters[0];
		}
		public static parse_pre(source: string, language: string = ""): HTMLPreElement
		{
			const lines: string[] = source
				.replace(/^(?:\s*\n)+/g, "")
				.trimEnd()
				.split(/\n/); // Remove trailing and leading newlines.
			const tab_count: number = lines[0].match(/^\s*/)![0].length;
			const element: HTMLPreElement = document.createElement("pre");
			for (const [each_line_index, each_line_with_tab] of lines.entries())
			{
				let each_line = each_line_with_tab.slice(tab_count);
				const line_number: HTMLElement = document.createElement("span");
				line_number.classList.add("line-number");
				line_number.innerText = (Number(each_line_index) + 1).toString();
				const line: HTMLElement = document.createElement("span");
				line.classList.add("line");
				line.innerText = each_line;
				element.appendChild(line_number);
				element.appendChild(line);
			}
			return element;
		}
		public static parse_math(source: string): HTMLElement
		{
			interface element_group
			{
				elements: MathMLElement[];
				parent: MathMLElement;
			}
			const element: MathMLElement = nodes.math_element("math");
			const element_stack: element_group[] = [{ elements: [], parent: element }]; // The first entry should never be popped.
			for (const each_match of source.matchAll(/\\(?:matrix\{|[a-zA-Z0-9]+|[\\|{}])|\^{2}|_{2}|>{2,3}|<{2,3}|[<>]=|->|[^0-9\\]|\d+(?:\.\d+)?/g))
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
				else if (constant.math_unary_operator.has(each_symbol))
				{
					const new_element: MathMLElement = nodes.math_element(constant.math_unary_operator.get(each_symbol)!);
					current_elements.push(new_element);
					element_stack.push({ elements: [], parent: new_element });
				}
				else if (constant.math_binary_operator.has(each_symbol))
				{
					const base_element: MathMLElement = current_elements.pop() ?? nodes.math_element("mrow");
					const new_element: MathMLElement = nodes.math_element(constant.math_binary_operator.get(each_symbol)!);
					current_elements.push(new_element);
					element_stack.push({ elements: [base_element], parent: new_element });
				}
				else if (constant.math_operator_replace.has(each_symbol))
				{
					const new_element: MathMLElement = nodes.math_element("mo");
					new_element.textContent = constant.math_operator_replace.get(each_symbol)!;
					current_elements.push(new_element);
				}
				else if (constant.math_identifier_replace.has(each_symbol))
				{
					const new_element: MathMLElement = nodes.math_element("mi");
					if (constant.math_variant_normal_identifiers.includes(each_symbol))
						new_element.setAttribute("mathvariant", "normal");
					new_element.textContent = constant.math_identifier_replace.get(each_symbol)!;
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
				while ((constant.math_parameter_count.get(current_level.parent.nodeName as keyof MathMLElementTagNameMap) ?? +Infinity) <= current_level.elements.length)
				{
					element_stack.pop();
					if (current_level.parent.nodeName !== "mroot")
					{
						nodes.attach(current_level.parent, current_level.elements);
					}
					else // mrow needs to reverse to support 3\root 2
					{
						nodes.attach(current_level.parent, current_level.elements.reverse())
					}
					current_level = element_stack[element_stack.length - 1];
				}
			}
			for (const each_element of element_stack[0].elements)
				element.appendChild(each_element);
			return element as HTMLElement;
		}
	}
}

window.addEventListener("DOMContentLoaded", () => {
	const nav_element = document.querySelector("body>nav>ol.catalogue");
	const source_elements = document.querySelectorAll("[data-type='source']");
	for (const each_source_element of source_elements)
	{
		const parser = new parse_source.Parser();
		parser.target = each_source_element as HTMLElement;
		parser.target_nav = nav_element as HTMLElement;
		parser.source = each_source_element.textContent?.replace(/\n\t*/g, "\n") ?? "";
		parser.parse();
	}
});

window.addEventListener("DOMContentLoaded", () => {
	const main_element = document.querySelector("main");
	if (main_element === null || main_element.dataset.type === "source")
		return;
	const pre_elements = document.querySelectorAll("pre");
	for (const each_pre_element of pre_elements)
	{
		const language: string = each_pre_element.dataset.language ?? "";
		const src: string | null = each_pre_element.getAttribute("src");
		if (src === null)
		{
			const parsed_pre: HTMLPreElement = parse_source.Parser.parse_pre(each_pre_element.innerText, language);
			each_pre_element.replaceWith(parsed_pre);
		}
		else
		{
			const file_request = new XMLHttpRequest();
			file_request.open("GET", src, true);
			file_request.onload = function ()
			{
				if (file_request.status === 200)
				{
					const parsed_pre: HTMLPreElement = parse_source.Parser.parse_pre(each_pre_element.innerText, language);
					each_pre_element.replaceWith(parsed_pre);
				}
				else
					each_pre_element.innerText = "Unable to load file.";
			}
			file_request.send();
		}
	}
});