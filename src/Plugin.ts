import { Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, WikiPluginSettings, WikiSettingsTab} from "./PluginSettings";
import SampleModal from "./Modal";

class WikiPlugin extends Plugin {
	settings: WikiPluginSettings;

	async onload() {
		await this.loadSettings();

		this.init();
		this.addSettingTab(new WikiSettingsTab(this.app, this));
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {}


	init() {
		this.addCommand({
			id: 'open-import-modal',
			name: 'Open the Importer',
			callback: () => {
				new SampleModal(this.app, this.settings.countryPrefix).open();
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
