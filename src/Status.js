import { useState, useEffect } from 'react';
import { myConfig } from './config';
import './status.css'

const { origin, client } = myConfig[process.env.REACT_APP_CAEN];
const { updatetime, aborttime } = myConfig[process.env.REACT_APP_CAEN].status;


const badgecolors = {
    good: "#b4eda0",
    failed: "#ffd5d1",
    warning: "#ffebb6",
}

const badgecomments = {
    good: "OK",
    failed: "FAIL",
    warning: "..."
};

function StatusBadge({ name, apiroute }) {
    const [badgestatus, setStatus] = useState('good');
    const apirequest = (apiroute) => {
        const controller = new AbortController();
        const signal = controller.signal;
        setTimeout(() => controller.abort(), aborttime);

        fetch(`${origin}/${apiroute}/status?` + new URLSearchParams({
            sender: client,
        }).toString(), { signal: signal }
        ).then(response => {
            setStatus(() => (response.ok ? 'good' : 'failed'));
        }).catch(err => {
            setStatus('failed');
        });
    };

    useEffect(() => {
        apirequest(apiroute);
        const interval = setInterval(() => { apirequest(apiroute) }, updatetime);
        return () => clearInterval(interval);
    }, [apiroute]);

    const badgecomment = `${name}: ${badgecomments[badgestatus]}`;
    return (
        <StatusBadgeDiv title={badgecomment} background={badgecolors[badgestatus]} />
    );
}

function StatusBadgeDiv({ title, background }) {
    return (<div>
        <span className="badge" style={{ background: background }}>{title}</span>
    </div>);
}

const StatusBadgeSysCheck = () => {
    const title = "SysCheck";
    const [badgestatus, setStatus] = useState('good');
    const apiroute = 'system_check/last_check';

    const apirequest = (apiroute) => {
        const controller = new AbortController();
        const signal = controller.signal;
        setTimeout(() => controller.abort(), aborttime);

        fetch(`${origin}/${apiroute}?` + new URLSearchParams({
            sender: client,
        }).toString(), { signal: signal }
        ).then(response => (response.json())
        ).then(response => {
            if (response.response.statuscode !== 1) {
                setStatus('failed');
                return;
            }
            const answer = response.response;
            setStatus(() => (parseInt(answer.timestamp) - parseInt(answer.body.last_check) < 30 ? 'good' : 'failed'));
        }).catch(err => {
            setStatus('failed');
        });
    };

    useEffect(() => {
        apirequest(apiroute);
        const interval = setInterval(() => { apirequest(apiroute) }, updatetime);
        return () => clearInterval(interval);
    }, [apiroute]);

    const comment = badgecomments[badgestatus];
    return (<StatusBadgeDiv title={`${title}: ${comment}`} background={badgecolors[badgestatus]} />);
};

const StatusBadgeILockFollow = () => {
    const title = "Interlock";
    const comments = {
        good: "FLW",
        warning: "NO FLW",
        failed: "...",
    };
    const [badgestatus, setStatus] = useState('failed');
    const apiroute = 'system_check/is_interlock_follow';

    const apirequest = (apiroute) => {
        const controller = new AbortController();
        const signal = controller.signal;
        setTimeout(() => controller.abort(), aborttime);

        fetch(`${origin}/${apiroute}?` + new URLSearchParams({
            sender: client,
        }).toString(), { signal: signal }
        ).then(response => (response.json())
        ).then(response => {
            if (response.response.statuscode !== 1) {
                setStatus('failed');
                return;
            }
            const ilockfollow = response.response.body.interlock_follow;
            setStatus(() => (ilockfollow ? 'good' : 'warning'));
        }).catch(err => {
            setStatus('failed');
        });
    };

    useEffect(() => {
        apirequest(apiroute);
        const interval = setInterval(() => { apirequest(apiroute) }, updatetime);
        return () => clearInterval(interval);
    }, [apiroute]);

    const comment = comments[badgestatus];
    return (<StatusBadgeDiv title={`${title}: ${comment}`} background={badgecolors[badgestatus]} />);
};

export function StatusBlock() {
    return (
        <div className="statusbody">
            <StatusBadge name="Device" apiroute="device_backend" />
            <StatusBadge name="Monitor" apiroute="monitor" />
            <StatusBadgeSysCheck />
            <StatusBadgeILockFollow />
        </div>
    );
}