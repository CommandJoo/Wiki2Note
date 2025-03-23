import {App, PluginSettingTab, Setting} from "obsidian";
import WikiPlugin from "./Plugin";
import {LANGUAGE_CODES, toPair} from "./LanguageCodes";

interface WikiPluginSettings {
	countryPrefix: string;
	tableBackground: string;
	tableBorder: string;
}

const DEFAULT_SETTINGS: WikiPluginSettings = {
	countryPrefix: 'en',
	tableBackground: '#323232',
	tableBorder: '#434343',
}

class WikiSettingsTab extends PluginSettingTab {
	plugin: WikiPlugin;

	constructor(app: App, plugin: WikiPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Country prefix')
			.setDesc("The prefix you want for the Language you use.Example: *en*.wikipedia.org")
			.addDropdown((dropdown) => {

				for(let i = 0; i < LANGUAGE_CODES.length; i++) {
					const pair = toPair(i);
					dropdown.addOption(pair[1], pair[0]);
				}

				dropdown.setValue(this.plugin.settings.countryPrefix);
				dropdown.onChange(async (value) => {
					this.plugin.settings.countryPrefix = value;
					await this.plugin.saveSettings();
				});
			});
		new Setting(containerEl)
			.setName('Table Background')
			.setDesc("The Background color of Tables or Images")
			.addColorPicker((color) => {

				color.setValue(this.plugin.settings.tableBackground);
				color.onChange(async (value) => {
					this.plugin.settings.tableBackground = value;
					await this.plugin.saveSettings();
				});
			});
		new Setting(containerEl)
			.setName('Table Border')
			.setDesc("The Border color of Tables or Images")
			.addColorPicker((color) => {

				color.setValue(this.plugin.settings.tableBorder);
				color.onChange(async (value) => {
					this.plugin.settings.tableBorder = value;
					await this.plugin.saveSettings();
				});
			});
	}
}

export type { WikiPluginSettings };
export {DEFAULT_SETTINGS };
export {WikiSettingsTab};
