import { myConfig } from './config';
import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const updateInterval = myConfig.chart.updatetime;

const host = myConfig.host.dev;
let port = myConfig.port;

class MulilineChart extends Component {
	constructor() {
		super();
		this.updateChart = this.updateChart.bind(this);
		this.toggleDataSeries = this.toggleDataSeries.bind(this);
		this.state = { dataP: new Map(), timestamp: Math.floor(Date.now() / 1000) - 60 * 10 };
		// console.log(this.state.timestamp);
	}
	setOptions() {
		let options = {
			zoomEnabled: true,
			theme: "light2",
			title: {
				text: ""
			},
			axisX: {
				title: "Time, [s]"
			},
			axisY: {
				suffix: " V"
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				verticalAlign: "top",
				fontSize: 12,
				fontColor: "dimGrey",
				itemclick: this.toggleDataSeries
			},
			data: []
		};
		for (const [key, value] of this.state.dataP) {
			// console.log(key);

			const block = {
				type: 'line',
				xValueFormatString: "D'th' MMMM hh:mm tt",
				yValueFormatString: "#,##0 V",
				showInLegend: true,
				name: `Сh ${key}`,
				dataPoints: value
			}
			options['data'].push(block);
		}
		return options;
	}

	componentDidMount() {
		this.updateChart(1);
		setInterval(this.updateChart, updateInterval);
	}
	toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		this.chart.render();
	}
	updateChart(count) {
		fetch(`http://${host}:${port}/params?time=${this.state.timestamp}`)
			.then(response => response.json()).then(
				response => {
					let timestamp = this.state.timestamp;
					let dataP = this.state.dataP;

					for (const row of response.slice().reverse()) {
						// console.log(JSON.stringify(row));
						const { chidx, v, t } = row;
						const prepared_point = { y: v, x: new Date(t * 1000) };
						if (dataP.has(chidx)) {
							dataP.set(chidx, [...dataP.get(chidx), prepared_point]);
						}
						else {
							dataP.set(chidx, [prepared_point]);
						}
						// console.log(this.timestamp, t);
						timestamp = Math.max(timestamp, t);
					}

					// console.log(JSON.stringify(dataP));
					this.setState({
						timestamp: timestamp,
						dataP: dataP
					});
				}
			)
		// this.chart.options.data[0].legendText = " Ch1 - " + 100 + " V";
		// this.chart.options.data[1].legendText = " Ch2 - " + 200 + " V";
		this.chart.render();
	}
	render() {
		const options = this.setOptions();
		return (
			<div>
				<CanvasJSChart options={options}
					onRef={(ref) => { this.chart = ref }}
				/>
			</div>
		);
	}
}

export { MulilineChart }