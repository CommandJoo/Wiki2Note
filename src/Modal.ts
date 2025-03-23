import {App, Modal, Notice} from "obsidian";
import axios from "axios";
import TurndownService from "turndown";
import * as cheerio from "cheerio";

class SampleModal extends Modal {
	private prefix: string;

	constructor(app: App, prefix: string) {
		super(app);
		this.prefix = prefix;
	}

	private input: HTMLInputElement;

	async onOpen() {
		const {contentEl} = this;

		contentEl.style.padding = '20px';
		contentEl.style.display = 'flex';
		contentEl.style.flexDirection = 'column'; // Stack elements vertically
		contentEl.style.gap = '10px'; // Add space between elements

		const label = contentEl.createEl('label', { text: 'Name of the Wikipedia Entry:' });
		label.setAttr('for', 'text-input');
		this.input = contentEl.createEl("input", {type: "text"});
		this.input.id = 'text-input';

		const submitButton = contentEl.createEl('button', { text: 'Generate' });
		submitButton.onclick = async () => {
			await this.handleSubmit();
			this.close();
		};

		const evtListener = async (e: KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === 'Tab') {
				await this.handleSubmit();
				this.close();
				rm();
			}
		};

		function rm() {
			removeEventListener("keydown", evtListener);
		}

		addEventListener("keydown", evtListener)
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	async handleSubmit() {
		await convertToNote(this.input.value, this.prefix);
	}
}

async function fetchWikipediaMarkdown(title: string, prefix: string) {
	const url = `https://${prefix}.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`;
	try {
		const response = await axios.get(url, { headers: { "User-Agent": "WikiToMarkdownBot/1.0" } });

		const $ = cheerio.load(response.data);
		$("style").remove();

		$(".hatnote").each((_, hatnote) => {
			const $hatnote = $(hatnote);
			$hatnote.find("a").each((_, link) => {
				const $link = $(link);
				const href = $link.attr("href");
				if (href && href.startsWith("/wiki/")) {
					$link.attr("href", `https://en.wikipedia.org${href}`);
				}
			});
			$hatnote.replaceWith(`> **${$hatnote.text().trim()}**`);
		});

		$("figure").each((_, figure) => {
			const $figure = $(figure);
			let imgLink = $figure.find("a").find("img").attr("src");
			if (imgLink && imgLink.startsWith("//")) {
				imgLink = `https:${imgLink}`;
			}
			const caption = $figure.find("figcaption").text();

			const html = `
<span class="figure" style="display: inline-block; float: right; max-width: 200px; border: 2px solid #434343; background-color: #323232; padding: 5px; margin: 10px; clear: both;">
	<img class="figureimg" src="${imgLink}">
	<p>${caption}</p>
</span>
			`
			$figure.replaceWith(`${html}`);
		});

		$("table").each((_, table) => {
			const $table = $(table);

			$table.find("img").each((_, img) => {
				const newImg = $(img);
				let src = $(img).attr("src");
				if (src && src.startsWith("//")) {
					src = `https:${src}`;
					newImg.attr("src", src);
				}

				let srcset = $(img).attr("srcset");
				if (srcset && srcset.startsWith("//")) {
					srcset = `https:${srcset}`;
					newImg.attr("srcset", srcset);
				}

				$(img).replaceWith(newImg);
			});
			// $table.css("display", "inline");
			$table.css("background-color", "#323232");
			$table.css("overflow", "scroll");
			$table.replaceWith($table);
		});

		$("img").each((_, img) => {
			const $img = $(img);
			if($img.hasClass("figureimg")) return;
			let src = $img.attr("src");
			if (src && src.startsWith("//")) {
				src = `https:${src}`;
			}
			if (src) {
				$img.attr("src", src); // Store the correct src in `data-src`
			}
		});

		$("a").each((_, link) => {
			const href = $(link).attr("href");
			if (href && href.startsWith("/wiki/")) {
				$(link).attr("href", `https://en.wikipedia.org${href}`);
			}
		});

		const cleanedHTML = $.html();
		const turndownService = new TurndownService();
		turndownService.keep("table")
		turndownService.addRule("figures", {
			filter: "span",
			replacement: (content, node) => {
				if(node) {
					if((node as HTMLElement)?.getAttribute("class") == ("figure")) {
						const el = node as HTMLElement;
						return `${el.outerHTML}`;
					}else {
						return content;
					}
				}
				return "";
			}
		})
		turndownService.addRule('underscoreHeaders', {
			filter: ['h1', 'h2'],
			replacement: function(content, node) {
				const level = node.nodeName.toLowerCase() === 'h1' ? 1 : 2;
				const underlineChar = '_'; // Use underscore for the underline
				return `${"#".repeat(level)} ${content}\n${underlineChar.repeat(content.length)}\n`;
			}
		});

		return turndownService.turndown(cleanedHTML).replace(/\\([*#_~`>])/g, "$1");
	} catch (error) {
		new Notice("Error fetching Wikipedia page.");
		console.error(error);
		return null;
	}
}

async function createAndOpenNote(fileName: string, content: string) {
	const filePath = `${fileName}.md`;

	const file = await this.app.vault.create(filePath, content);

	const leaf = this.app.workspace.getLeaf();
	await leaf.openFile(file);
}


async function convertToNote(title: string, prefix: string) {
	const fileName = `${title.replace(/[^a-zA-Z0-9]/g, "_")}`;
	await createAndOpenNote(fileName, `# ${title}\n\n${await fetchWikipediaMarkdown(title, prefix)}`)
}
export default SampleModal;
