import { myConfig } from '../config';
import { MulilineChart } from './Chart.js'
import { SystemStateTable } from './Table.js';
import './charts.css'
import styles from './charts.module.css'
import { useState, useEffect } from 'react';

const { origin } = myConfig[process.env.REACT_APP_CAEN];
const { last_minutes, aborttime } = myConfig[process.env.REACT_APP_CAEN].chart;


export function ChartBlock() {

    const [data, setData] = useState([]);
    const [target, setTarget] = useState("...");
    const [loaded, setLoaded] = useState(false);
    const [lastdata, setLastdata] = useState({});

    // Fetch historical data
    useEffect(() => {
        const lastupd = (Math.floor(Date.now() / 1000) - 60 * last_minutes);

        const controller = new AbortController();
        const signal = controller.signal;
        setTimeout(() => controller.abort(), aborttime);

        fetch(`${origin}/monitor/getparams?start_timestamp=${lastupd}`, { signal: signal })
            .then(response => response.json()).then(
                response => {
                    const resp = response['response']['body'];
                    // console.log(JSON.stringify(resp))
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
                    }
                    setLoaded(true);

                }
            ).catch(err => {
                setLoaded(true);
            });
    }, [loaded]);

    // Subscribe to Server sent events 
    useEffect(() => {
        if (!loaded)
            return;

        const sse = new EventSource(`${origin}/device_backend/params_broadcast`);
        sse.onmessage = (event) => {
            const response = JSON.parse(event.data).response;
            const timestamp = response.timestamp;
            const respdata = Object(response['body']['params']);
            for (const chidx of Object.keys(respdata)) {
                const imon_key = (respdata[chidx]['ImonRange'] === 0) ? "IMonH" : "IMonL";
                const point = {
                    time: new Date(timestamp * 1000),
                    voltage: respdata[chidx]['VMon'],
                    current: respdata[chidx][imon_key],
                };
                setData(prevState => {
                    if (!(chidx in prevState)) {
                        return { ...prevState, [chidx]: [point] };
                    }
                    return { ...prevState, [chidx]: [...prevState[chidx], point] };
                });
                setLastdata(prevState => ({ ...prevState, [chidx]: { ...point, status: respdata[chidx]['ChStatus'] } }));

                const { VSet, VDef } = respdata[chidx];
                if (VDef > 0) {
                    setTarget(+(VSet / VDef).toFixed(4));
                }
            }
        };
        return () => { sse.close() };
    }, [loaded]);

    return (
        <div className='datablock'>
            <div className='charts'>
                <MulilineChart
                    classname="multilinechart"
                    yaxis="voltage"
                    suffixY="V"
                    yValueFormatString="# ##0 V"
                    data={data}>
                    <p class={styles.p}>Voltage (multiplier now:&nbsp;
                        <div class={styles.tooltip}>{target}
                            <span class={styles.tooltiptext}> 2000 ⋅ {target} = {(2000 * target).toFixed(1)}</span>
                        </div>)
                    </p>
                </MulilineChart>
                <MulilineChart
                    classname="multilinechart"
                    yaxis="current"
                    data={data}
                    suffixY="μA"
                    yValueFormatString="# ##0.###0 μA"
                    startOnMount>
                    <p class={styles.p}>Current</p>
                </MulilineChart>
            </div>
            <div className='table'>
                <SystemStateTable datarows={lastdata} />
            </div>
        </div>);
}