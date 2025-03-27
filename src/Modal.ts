import {App, Modal} from "obsidian";
import {WikiPluginSettings} from "./PluginSettings";
import WikipediaNote from "./WikipediaNote";

class WikiModal extends Modal {
	private settings: WikiPluginSettings;

	constructor(app: App, settings: WikiPluginSettings) {
		super(app);
		this.settings = settings;
	}

	private input: HTMLInputElement;

	async onOpen() {
		const {contentEl} = this;
		contentEl.classList.add("wiki-modal");

		const label = contentEl.createEl('label', { text: 'Name of the Wikipedia Entry:' });
		label.setAttr('for', 'text-input');
		this.input = contentEl.createEl("input", {type: "text"});
		this.input.id = 'text-input';

		const submitButton = contentEl.createEl('button', { text: 'Generate' });
		submitButton.onclick = async () => {
			await this.handleSubmit();
			this.close();
		};
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	async handleSubmit() {
		if(this.input.value != "") await new WikipediaNote(this.settings).create(this.input.value);

	}
}


export default WikiModal;
