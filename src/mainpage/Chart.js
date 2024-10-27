import { myConfig } from '../config';
import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJS = CanvasJSReact.CanvasJS;
CanvasJS.addCultureInfo("ru",
	{
		decimalSeparator: ",",
		digitGroupSeparator: " ",
	}
);
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


const { last_minutes } = myConfig[process.env.REACT_APP_CAEN].chart;

const mintime = () => { return new Date((Math.floor(Date.now() / 1000) - 60 * last_minutes) * 1000); };

const MulilineChart = ({ data, classname, ChartName, suffixY, yaxis, yValueFormatString }) => {
	const [options, setOptions] = useState({
		culture: "ru",
		zoomEnabled: true,
		zoomType: 'xy',
		animationEnabled: false,
		theme: "light2",
		axisX: {
			valueFormatString: "HH:mm",
			minimum: mintime(),
			title: "Time",
			titleFontSize: 18,
		},
		axisY: {
			suffix: ` ${suffixY}`
		},
		toolTip: {
			shared: true
		},
		legend: {
			verticalAlign: "bottom",
			fontSize: 10,
			fontColor: "dimGrey",
		},
		data: [{
			type: 'line',
			dataPoints: []
		}]  // empty data
	});

	useEffect(() => {
		const datasets = Object.keys(data).map(function (key) {
			const datapoints = data[key];
			return {
				type: 'line',
				xValueFormatString: "HH:mm:ss",
				yValueFormatString: yValueFormatString,
				showInLegend: true,
				name: `Сh ${key}`,
				markerType: 'none',
				dataPoints: datapoints.map((item) => {
					return {
						x: item.time,
						y: item[yaxis],
					}
				}),
			}
		});
		setOptions(prevState => ({ ...prevState, data: datasets }));
	}, [data, yaxis, suffixY, yValueFormatString])

	return (
		<div className={classname}>
			<p style={{ fontSize: '20pt' }}>{ChartName}</p>
			<CanvasJSChart options={options} />
		</div>
	);
}

export { MulilineChart }
