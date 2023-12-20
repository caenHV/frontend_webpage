import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
 
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var dataPoints1 = [];
var dataPoints2 = [];
var updateInterval = 2000;
//initial values
var yValue1 = 408;
var yValue2 = 350;
var xValue = 5;

class MulilineChart extends Component {
	constructor() {
		super();
		this.updateChart = this.updateChart.bind(this);
		this.toggleDataSeries = this.toggleDataSeries.bind(this);
	}
	componentDidMount(){
		this.updateChart(1);
		setInterval(this.updateChart, updateInterval);
	}
	toggleDataSeries(e) {
		if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		this.chart.render();
	}
	updateChart(count) {
		count = count || 1;
		// var deltaY1, deltaY2;
		for (var i = 0; i < count; i++) {
			xValue += 2;
			// deltaY1 = 5 + Math.random() *(-5-5);
			// deltaY2 = 5 + Math.random() *(-5-5);
			yValue1 = Math.floor(Math.random()*(408-400+1)+400);
			yValue2 = Math.floor(Math.random()*(350-340+1)+340);
			dataPoints1.push({
			  x: xValue,
			  y: yValue1
			});
			dataPoints2.push({
			  x: xValue,
			  y: yValue2
			});
            if (dataPoints1.length >  20 ) {
                dataPoints1.shift();
                dataPoints2.shift();
            }
		}
		this.chart.options.data[0].legendText = " Ch1 - " + yValue1 + " V";
		this.chart.options.data[1].legendText = " Ch2 - " + yValue2 + " V";
		this.chart.render();
	}
	render() {
		const options = {
			zoomEnabled: true,
			theme: "light2",
			title: {
				text: ""
			},
			axisX: {
				title: "Time, [s]"
			},
			axisY:{
				suffix: " V"
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor:"pointer",
				verticalAlign: "top",
				fontSize: 16,
				fontColor: "dimGrey",
				itemclick : this.toggleDataSeries
			},
			data: [
				{
					type: "stepLine",
					xValueFormatString: "#,##0 seconds",
					yValueFormatString: "#,##0 V",
					showInLegend: true,
					name: "Bugatti Veyron",
					dataPoints: dataPoints1
				},
				{
					type: "stepLine",
					xValueFormatString: "#,##0 seconds",
					yValueFormatString: "#,##0 V",
					showInLegend: true,
					name: "Lamborghini Aventador" ,
					dataPoints: dataPoints2
				}
			]
		}
		return (
			<div>
				<CanvasJSChart options = {options}
					onRef={(ref) => {this.chart = ref}}
				/>
				{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
			</div>
		);
	}
}                        

export {MulilineChart}