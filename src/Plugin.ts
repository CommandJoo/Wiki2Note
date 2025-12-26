import { Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, WikiPluginSettings, WikiSettingsTab} from "./PluginSettings";
import WikiModal from "./Modal";
import WikiMultiModal from "./ModalMultiple";

class WikiPlugin extends Plugin {
	settings: WikiPluginSettings;

	async onload() {
		await this.loadSettings();

		this.init();
		this.addSettingTab(new WikiSettingsTab(this.app, this));
	}

	onunload() {}


	init() {
		this.addCommand({
			id: 'open-import-modal',
			name: 'Import wikipedia article',
			callback: () => {
				new WikiModal(this.app, this.settings).open();
			}
		});
		this.addCommand({
			id: 'open-import-modal-multi',
			name: 'Import multiple articles',
			callback: () => {
				new WikiMultiModal(this.app, this.settings).open();
			}
		});
	}



	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export default WikiPlugin;
