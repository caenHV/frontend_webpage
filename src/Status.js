import { useState, useEffect } from 'react';
import { myConfig } from './config';
import './status.css'

const { origin } = myConfig[process.env.REACT_APP_CAEN];
const { updatetime } = myConfig[process.env.REACT_APP_CAEN].status;

function StatusBadge({ name, apiroute }) {
    const [status, setStatus] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`${origin}/${apiroute}/status`)
                .then(response => {
                    setStatus(() => response.ok);
                });
        }, updatetime);
        return () => clearInterval(interval);
    }, [apiroute]);

    const badgestatus = status ? 'badgegood' : 'badgefailed';
    const badgecomment = status ? 'OK' : 'Failed';

    return (
        <div className='badgeBlock'>
            <span className={badgestatus}>{name}: {badgecomment}</span>
        </div>);

}

export function StatusBlock() {
    return (
        <div className="statusbody">
            <StatusBadge name="Device" apiroute="device_backend" />
            <StatusBadge name="Monitor" apiroute="monitor" good={false} />
        </div>
    );
}