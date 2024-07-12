import { myConfig } from './config';
import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { withIdleTimer, IdleTimerComponent } from 'react-idle-timer'

// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const updateInterval = myConfig.chart.updatetime;

const host = myConfig.host;
let port = myConfig.port;

class MulilineChartComponent extends IdleTimerComponent {
	constructor(props) {
		super(props);
		this.updateChart = this.updateChart.bind(this);
		this.toggleDataSeries = this.toggleDataSeries.bind(this);
		this.state = { dataP: new Map(), timestamp: this.getmintime(), presence: true };
		// console.log(this.state.timestamp);
	}

	onPresenceChange(presence) {
		// Handle state changes in one function
		// console.log(JSON.stringify(presence));
		this.setState({
			presence: (presence.type === "active")
		});
	}

	getmintime() {
		return Math.floor(Date.now() / 1000) - 60 * myConfig.chart.last_minutes;
	}
	setOptions() {
		let suffixY = " V";
		if (this.props.ChartName === "Current") {
			suffixY = " mA";
		}

		let options = {
			zoomEnabled: true,
			theme: "light2",
			title: {
				text: ""
			},
			axisX: {
				minimum: new Date(this.getmintime() * 1000),
				title: "Date time"
			},
			axisY: {
				suffix: suffixY
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				verticalAlign: "top",
				fontSize: 10,
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
		if (this.state.presence) {
			this.setState({
				timestamp: Math.max(this.state.timestamp, this.getmintime())
			});
			fetch(`http://${host}:${port}/monitor/getparams?start_timestamp=${this.state.timestamp}`)
				.then(response => response.json()).then(
					response => {

						// console.log(JSON.stringify(response));
						let timestamp = this.state.timestamp;
						let dataP = this.state.dataP;
						let resp = response['response']['body'];


						for (const row of resp.slice().reverse()) {
							// console.log(JSON.stringify(row));
							const { chidx, V, I, t } = row;
							let prepared_point;
							if (this.props.ChartName === "Current") {
								prepared_point = { y: I, x: new Date(t * 1000) };
							} else {
								prepared_point = { y: V, x: new Date(t * 1000) };
							}
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
			this.chart.render();
		}
	}
	render() {
		const options = this.setOptions();
		return (
			<div>
				<p style={{ fontSize: '20pt' }}>{this.props.ChartName}</p>
				<CanvasJSChart options={options}
					onRef={(ref) => { this.chart = ref }}
				/>
			</div>
		);
	}
}

// export { MulilineChart }
export const MulilineChart = withIdleTimer(MulilineChartComponent)