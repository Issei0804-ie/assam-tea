import {App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting} from 'obsidian';
import {
	CATEGORY_IDX,
	ENDING_WORK_TIME_IDX,
	getDate,
	getTimeAndCategory,
	isTimeAndCategory,
	STARTING_WORK_TIME_IDX
} from "./src/graph";
import {ModalData, ViewModal} from "./src/viewModal";


// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text, sample');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'assam-tea-view',
			name: 'Open pie chart',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log("eiya");
				const doc = editor.getDoc();
				const data = new ModalData();
				data.chartLabel = "sample";
				// this.app.vault.getMarkdownFiles();
				for (let i = 0; i < doc.lineCount(); i++) {
					const line = doc.getLine(i).trim();
					if (isTimeAndCategory(line)) {
						const timeAndCategory = getTimeAndCategory(line);
						const startingWorkTime = getDate(timeAndCategory[STARTING_WORK_TIME_IDX]);
						const endingWorkTime = getDate(timeAndCategory[ENDING_WORK_TIME_IDX]);
						const category = timeAndCategory[CATEGORY_IDX];
						const workTimeMin = (endingWorkTime.getTime() - startingWorkTime.getTime()) / (1000 * 60);
						data.labels.push(category);
						data.data.push(workTimeMin);
					}
				}
				new ViewModal(this.app, data).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});

		this.addCommand({
			id: 'assam-tea-timestamp-for-worktime',
			name: '#が4つついたTimestamp をえいやー',
			editorCallback: (editor: Editor, view: MarkdownView) => {

				const doc = editor.getDoc();
				const date = new Date();
				let doTimeStamp = false;

				for (let i = 0; i < doc.lineCount(); i++) {
					const line = doc.getLine(i).trim();
					if (isTimeAndCategory(line)) {
						const timeAndCategory = getTimeAndCategory(line);
						const endingWorkTime = getDate(timeAndCategory[ENDING_WORK_TIME_IDX]);
						const timestamp = `#### ${endingWorkTime.getHours().toString().padStart(2, '0')}:${endingWorkTime.getMinutes().toString().padStart(2, '0')} -`
						editor.replaceSelection(timestamp);
						doTimeStamp = true;
						break;
					}
				}

				if (!doTimeStamp){
					const timestamp = `#### ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} -`
					editor.replaceSelection(timestamp);
				}
			}
		});

		this.addCommand({
			id: 'assam-tea-timestamp',
			name: 'Timestamp をえいやー',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const date = new Date();
				const timestamp = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
				editor.replaceSelection(timestamp);
			}
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}
		//
		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
