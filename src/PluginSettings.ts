import {App, PluginSettingTab, Setting} from "obsidian";
import WikiPlugin from "./Plugin";
import {LANGUAGE_CODES, toPair} from "./LanguageCodes";

interface WikiPluginSettings {
	countryPrefix: string;
}

const DEFAULT_SETTINGS: WikiPluginSettings = {
	countryPrefix: 'en'
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
			})
			// .addText(text => text
			// 	.setPlaceholder('Enter your prefix')
			// 	.setValue(this.plugin.settings.countryPrefix)
			// 	.onChange(async (value) => {
			// 		this.plugin.settings.countryPrefix = value;
			// 		await this.plugin.saveSettings();
			// 	}));
	}
}

export type { WikiPluginSettings };
export {DEFAULT_SETTINGS };
export {WikiSettingsTab};
