import { useState, useEffect } from 'react';
import { myConfig } from './config';
import './status.css'

const { origin } = myConfig[process.env.REACT_APP_CAEN];
const { updatetime } = myConfig[process.env.REACT_APP_CAEN].status;

function StatusBadge({ name, apiroute }) {
    const [badgestatus, setStatus] = useState('good');
    const badgecomments = {
        good: "OK",
        failed: "Failed",
        warning: "..."
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`${origin}/${apiroute}/status`)
                .then(response => {
                    setStatus(() => (response.ok ? 'good' : 'failed'));
                });
        }, updatetime);
        return () => clearInterval(interval);
    }, [apiroute]);

    const badgecomment = `${name}: ${badgecomments[badgestatus]}`;
    return (
        <StatusBadgeDiv title={badgecomment} badgestatus={badgestatus} />
    );
}

function StatusBadgeDiv({ title, badgestatus }) {
    return (<div>
        <span className={["badge", badgestatus].join(' ')}>{title}</span>
    </div>);
}

export function StatusBlock() {
    return (
        <div className="statusbody">
            <StatusBadge name="Device" apiroute="device_backend" />
            <StatusBadge name="Monitor" apiroute="monitor" />
            {/* <StatusBadgeDiv title="Interlock: UP" badgestatus="warning" /> */}
        </div>
    );
}