import {App, Modal} from "obsidian";
import {Chart} from "chart.js/auto";

export class ModalData {
	labels: string[];
	data: number[];
	chartLabel: string;
	yTicksLabel = "m";


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

		this.yTicksLabel = "h";

		return this.data.map((value) => {
			return (value / 60);
		})
	}

	getYTicsLabel(): string {
		return this.yTicksLabel;
	}
}

export class ViewModal extends Modal {
	data: ModalData;

	constructor(app: App, data: ModalData) {
		super(app);
		this.data = data;
		console.log(this.data.getYTicsLabel());
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
						ticks: {
							callback: (value, index, values) => {
								return value + this.data.getYTicsLabel();
							}
						},
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
