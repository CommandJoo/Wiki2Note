import {App, Modal} from "obsidian";
import {WikiPluginSettings} from "./PluginSettings";
import WikipediaNote from "./WikipediaNote";

class SampleModal extends Modal {
	private settings: WikiPluginSettings;

	constructor(app: App, settings: WikiPluginSettings) {
		super(app);
		this.settings = settings;
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
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	async handleSubmit() {
		if(this.input.value != "") await new WikipediaNote(this.settings).create(this.input.value);

	}
}


export default SampleModal;
