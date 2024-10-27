import { useState, useEffect } from 'react';
import { clickScreen } from './Screen';
import { myConfig } from '../config';
import './status.css'

const { origin } = myConfig[process.env.REACT_APP_CAEN];


const badgecolors = {
    good: "#b4eda0",
    failed: "#ffd5d1",
    warning: "#ffebb6",
}

function StatusBadgeDiv({ title, background, border = false }) {
    const border_style = border ? `1px black solid` : `1px ${background} solid`
    return (<div>
        <span className="badge" style={{ background: background, border: border_style }}>{title}</span>
    </div>);
}

export function StatusBlock() {

    const [status, setStatus] = useState({
        device: {
            title: "Device ...",
            background: badgecolors.warning,
        },
        monitor: {
            title: "Monitor ...",
            background: badgecolors.warning,
        },
        syscheck: {
            title: "System check ...",
            background: badgecolors.warning,
        },
        autopilot: {
            title: "Autopilot ...",
            background: badgecolors.warning,
        },
    });

    // Watch on status of the system
    useEffect(() => {
        const sse_devstatus = new EventSource(`${origin}/events/status`);
        sse_devstatus.onmessage = (event) => {
            const response = JSON.parse(event.data);

            // console.log(JSON.stringify(response));
            const isgood_devback = (parseInt(response.device_backend.statuscode) === 1);
            const isgood_monitor = (parseInt(response.monitor.statuscode) === 1);
            const isgood_syscheck = (parseInt(response.system_check.statuscode) === 1);
            
            const get_autopilot_state = (response) => {
                const data = Object(response.body);
                if (!("autopilot" in data)) {
                    return {
                        title: "Autopilot: ...",
                        background: badgecolors.failed,
                    };
                }
                const isenable = data.autopilot.enable;
                return {
                    title: `Autopilot: ${isenable ? "ON" : "OFF"}`,
                    background: isenable ? badgecolors.good : badgecolors.warning,
                };
            };

            const state = {
                device: {
                    title: `Device: ${isgood_devback ? "OK" : "FAIL"}`,
                    background: isgood_devback ? badgecolors.good : badgecolors.failed,
                },
                monitor: {
                    title: `Monitor: ${isgood_monitor ? "OK" : "FAIL"}`,
                    background: isgood_monitor ? badgecolors.good : badgecolors.failed,
                },
                syscheck: {
                    title: `System check: ${isgood_syscheck ? "OK" : "FAIL"}`,
                    background: isgood_syscheck ? badgecolors.good : badgecolors.failed,
                },
                autopilot: get_autopilot_state(response.system_check),
            }

            setStatus(state);
        };

        sse_devstatus.onerror = (event) => {
            setStatus({
                device: {
                    title: "Device: no connect",
                    background: badgecolors.failed,
                },
                monitor: {
                    title: "Monitor: no connect",
                    background: badgecolors.failed,
                },
                syscheck: {
                    title: "System check: no connect",
                    background: badgecolors.failed,
                },
                autopilot: {
                    title: "Autopilot: no connect",
                    background: badgecolors.failed,
                },
            });
        }

        return () => (sse_devstatus.close());
    }, []);

    return (<div>
        <div className="statusbody">
            <StatusBadgeDiv title={status.device.title} background={status.device.background} />
            <StatusBadgeDiv title={status.syscheck.title} background={status.syscheck.background} />
            <StatusBadgeDiv title={status.monitor.title} background={status.monitor.background} />
            <StatusBadgeDiv title={status.autopilot.title} background={status.autopilot.background} />
        </div>
        <div className="statusbody">
            <StatusBadgeDiv title={<a href='/log'>Log page</a>} background="#ffffff" border={true} />
            <StatusBadgeDiv title={<a href="#screen" onClick={()=>{clickScreen()}}>Screenshot</a>} background="#ffffff" border={true} />
        </div>
    </div>);
}