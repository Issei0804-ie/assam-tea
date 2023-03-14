import {App, Modal} from "obsidian";
import {Chart} from "chart.js/auto";

export class ModalData{
	labels: string[];
	data: number[];
	chartLabel: string;
	constructor() {
		this.data = [];
		this.labels = [];
	}
}

export class ViewModal extends Modal {
	data:ModalData;
	constructor(app: App, data:ModalData) {
		super(app);
		this.data=data;
	}

	onOpen() {
		const {contentEl} = this;
		const hoge = contentEl.createEl("canvas", {});
		hoge.id = "hoge";
		const chart = new Chart(hoge.id,{
			type: 'bar',
			data: {
				labels: this.data.labels,
				datasets: [{
					label: this.data.chartLabel,
					data: this.data.data,
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
