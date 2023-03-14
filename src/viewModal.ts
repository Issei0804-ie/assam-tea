import {App, Modal} from "obsidian";
import {Chart} from "chart.js/auto";

export class ModalData {
	labels: string[];
	data: number[];
	chartLabel: string;

	constructor() {
		this.data = [];
		this.labels = [];
	}

	getData(): number[] {
		let oneHourOrMore = false;
		oneHourOrMore = this.data.some(value => {
			return value >= 60;
		});
		if (!oneHourOrMore) return this.data;

		return this.data.map((value) => {
			return value / 60;
		})
	}
}

export class ViewModal extends Modal {
	data: ModalData;

	constructor(app: App, data: ModalData) {
		super(app);
		this.data = data;
	}

	onOpen() {
		const {contentEl} = this;
		const hoge = contentEl.createEl("canvas", {});
		hoge.id = "hoge";
		const chart = new Chart(hoge.id, {
			type: 'bar',
			data: {
				labels: this.data.labels,
				datasets: [{
					label: this.data.chartLabel,
					data: this.data.getData(),
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});

		chart.draw();

	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
