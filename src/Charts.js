import {MulilineChart} from './Chart.js'
import './charts.css'

export function ChartBlock() {
    return (
        <>
            <div className='charts'>
                <h2>Charts</h2>
                <MulilineChart ChartName="Voltage" />
                <MulilineChart ChartName="Current" />
            </div>
        </>);
}