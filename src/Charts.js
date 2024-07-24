import { myConfig } from './config';
import { MulilineChart } from './Chart.js'
import './charts.css'

const { idle_seconds } = myConfig[process.env.REACT_APP_CAEN].chart;

export function ChartBlock() {
    return (
        <>
            <div className='charts'>
                <MulilineChart
                    ChartName="Voltage"
                    timeout={1000 * idle_seconds}
                    immediateEvents={['visibilitychange']}
                    startOnMount />
                <MulilineChart
                    ChartName="Current"
                    timeout={1000 * idle_seconds}
                    immediateEvents={['visibilitychange']}
                    startOnMount />
            </div>
        </>);
}