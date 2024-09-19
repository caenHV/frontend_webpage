import { myConfig } from './config';
import { MulilineChart } from './Chart.js'
import { SystemStateTable } from './Table.js';
import './charts.css'
import { useState, useEffect } from 'react';

const { origin, host } = myConfig[process.env.REACT_APP_CAEN];
const { last_minutes } = myConfig[process.env.REACT_APP_CAEN].chart;


export function ChartBlock() {

    const [data, setData] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [lastdata, setLastdata] = useState({});

    // Fetch historical data
    useEffect(() => {
        const lastupd = (Math.floor(Date.now() / 1000) - 60 * last_minutes);
        fetch(`${origin}/monitor/getparams?start_timestamp=${lastupd}`)
            .then(response => response.json()).then(
                response => {
                    const resp = response['response']['body'];
                    const prepdata = {};
                    for (const row of resp.slice().reverse()) {
                        const { chidx, V, I, t } = row;
                        const point = {
                            time: new Date(t * 1000),
                            voltage: V,
                            current: I,
                        };
                        if (prepdata.hasOwnProperty(chidx)) {
                            prepdata[chidx].push(point);
                        }
                        else {
                            prepdata[chidx] = [point]
                        }
                        setData(prepdata);
                        setLoaded(true);
                    }

                }
            );
    }, [loaded]);

    // Subscribe to WebSocket 
    useEffect(() => {
        if (!loaded)
            return;

        const WS = new WebSocket(`ws://${host}/device_backend/ws`);
        WS.onmessage = (event) => {
            const response = JSON.parse(event.data);
            const timestamp = response.timestamp;
            const respdata = Object(response['body']['params']);
            for (const chidx of Object.keys(respdata)) {
                const point = {
                    time: new Date(timestamp * 1000),
                    voltage: respdata[chidx]['VMon'],
                    current: respdata[chidx]['IMonH'],
                };
                setData(prevState => ({ ...prevState, [chidx]: [...prevState[chidx], point] }));
                setLastdata(prevState => ({ ...prevState, [chidx]: point }));
            }
        };
    }, [loaded]);

    return (
        <div className='datablock'>
            <div className='charts'>
                <MulilineChart
                    classname="multilinechart"
                    yaxis="voltage"
                    ChartName="Voltage"
                    suffixY="V"
                    data={data} />
                <MulilineChart
                    classname="multilinechart"
                    yaxis="current"
                    ChartName="Current"
                    data={data}
                    suffixY="μA"
                    startOnMount />
            </div>
            <div className='table'>
                <SystemStateTable datarows={lastdata} />
            </div>
        </div>);
}