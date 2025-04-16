import {App, Modal} from "obsidian";
import {WikiPluginSettings} from "./PluginSettings";
import WikipediaNote from "./WikipediaNote";


class WikiMultiModal extends Modal {
	private settings: WikiPluginSettings;

	constructor(app: App, settings: WikiPluginSettings) {
		super(app);
		this.settings = settings;
	}

	private input: HTMLInputElement[];

	createInput(contentEl: HTMLElement, submitButton: HTMLButtonElement) {
		const newInput = contentEl.createEl("input", { type: 'text' });
		this.input.push(newInput);

		contentEl.insertBefore(newInput, submitButton);

		if(this.input.length >= 2) this.input[this.input.length-2].focus();

		this.input[this.input.length - 1].onclick = async () => {
			this.createInput(contentEl,submitButton)
		};
		this.input[this.input.length - 2].onclick = null;
	}

	async onOpen() {
		const {contentEl} = this;
		contentEl.classList.add("wiki-modal");

		contentEl.createEl('label', { text: 'Name of the Wikipedia entries:' });
		contentEl.createEl('label', {text: 'Click text field to add more...'});
		this.input = [];
		const firstInput = contentEl.createEl("input", {type: "text"});
		this.input.push(firstInput);

		const submitButton = contentEl.createEl('button', { text: 'Generate' });
		submitButton.onclick = async () => {
			await this.handleSubmit();
			this.close();
		};

		this.input[this.input.length - 1].onclick = async () => {
			this.createInput(contentEl,submitButton);
		};
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	async handleSubmit() {
		for(let i = 0; i < this.input.length; i++) {
			if(this.input[i].value != "") await new WikipediaNote(this.settings).create(this.input[i].value);
		}
		this.input = [];
	}
}


export default WikiMultiModal;
