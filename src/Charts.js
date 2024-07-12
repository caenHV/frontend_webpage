import { myConfig } from './config';
import { MulilineChart } from './Chart.js'
import './charts.css'

export function ChartBlock() {
    return (
        <>
            <div className='charts'>
                <h2>Charts</h2>
                <MulilineChart
                    ChartName="Voltage"
                    timeout={1000 * myConfig.chart.idle_seconds}
                    immediateEvents={['visibilitychange']}
                    startOnMount />
                <MulilineChart
                    ChartName="Current"
                    timeout={1000 * myConfig.chart.idle_seconds}
                    immediateEvents={['visibilitychange']}
                    startOnMount />
            </div>
        </>);
}