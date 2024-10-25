import { myConfig } from "../config";
import { useState } from "react";
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import './tickets.css';

import { DefaultButton, LoadingSpinner } from "../utils/UtilComponents";
import { RequestGET, RequestPOST } from "../utils/UtilConnection";

const { origin, client } = myConfig[process.env.REACT_APP_CAEN];

const options = [
    { value: 'autopilot', label: '‍✈️ Autopilot', route: 'system_check/set_interlock_follow', getroute: 'system_check/is_interlock_follow' },
    { value: 'down', label: '🙅‍♀️ Down Voltage', route: 'device_backend/down' },
    { value: 'set_voltage', label: '⚡ Set Voltage', route: 'device_backend/set_voltage' },
];

const toaster_style = {
    style: {
        fontSize: '18px',
    },
    error: {
        duration: 5000,
    }
};

const TicketDropdown = ({ onChange, submitQuery }) => {
    const customStyles = {
        container: ({ margin, ...css }) => ({
            ...css,
            margin: "0 5px"
        }),
        menu: ({ width, ...css }) => ({
            ...css,
            width: "max-content",
            minWidth: "100%"
        })
    };

    return (<div className="ticketDropdown">
        <Select styles={customStyles} options={options} onChange={onChange} placeholder="Select a ticket ..." />
        <button className="back" onClick={() => submitQuery(false)}>Back</button>
    </div>);
};


const TicketParametersSelection = ({ ticket }) => {
    if (ticket.value === "set_voltage") {
        return (<>
            <div className="ticketForm">
                <label className="ticketInput" htmlFor="target_voltage">Enter Voltage Multiplier: </label>
                <input className="ticketInput" type="number" placeholder="1.0" step="0.0001" min="0" max="1.1" name="target_voltage" id="voltage" required />
            </div>
        </>);
    };
    return (<></>);
};

const TicketInterlockToggle = (route, payload, onExecute = () => { }) => {
    const response = RequestPOSTExtend(route, payload);

    const label = payload.value ? 'Turn on autopilot' : 'Turn off autopilot';
    toast.promise(response, {
        loading: `Executing: ${label}`,
        success: `Success: ${label}`,
        error: (err) => {
            return `${label}: ${err.toString()}`
        },
    }, toaster_style);

    onExecute();
    return;
}

const TicketInterlock = ({ ticket, onExecute = () => { } }) => {
    const [status, setStatus] = useState(null);
    const setroute = `${origin}/${ticket.route}`;

    RequestGET(`${origin}/${ticket.getroute}`, { sender: client }).then(response => (response.json())
    ).then(response => {
        if (response.response.statuscode !== 1)
            setStatus('failed');
        const ilockfollow = response.response.body.interlock_follow;
        setStatus(() => (ilockfollow ? 'follow' : 'notfollow'));
    }).catch(err => {
        setStatus('failed');
    });


    if (status === 'failed')
        return (<>...Something wrong...</>);

    let payload = {
        sender: client,
        target_voltage: 0,
        value: true,
    }

    if (status === 'follow') {
        payload.value = false;
        return <DefaultButton
            text="Turn off autopilot"
            onClick={() => { TicketInterlockToggle(setroute, payload, onExecute) }}
        />;
    }
    if (status === "notfollow") {
        return (<>
            <form onSubmit={(e) => {
                e.preventDefault();

                const formData = new FormData(e.target);
                for (const [key, value] of formData) {
                    payload[key] = value;
                }

                TicketInterlockToggle(setroute, { ...payload, value: true }, onExecute);

            }}>
                <div className="ticketForm">
                    <label className="ticketInput" htmlFor="target_voltage">Enter Tagret Voltage Multiplier: </label>
                    <input className="ticketInput" type="number" placeholder="1.0" step="0.0001" min="0" max="1.1" name="target_voltage" id="voltage" required />
                </div>
                <DefaultButton
                    text="Turn on autopilot"
                />
            </form>
        </>);
    }

    return (<LoadingSpinner />);
}

const RequestPOSTExtend = (apiroute, payload) => {
    const response = RequestPOST(apiroute, payload).then(res => {
        if (!res.ok) {
            return res.json().then(res => {
                if (Array.isArray(res.detail)) {
                    const data = res.detail[0];
                    if ('msg' in data) {
                        throw new Error(data.msg);
                    }
                }
                throw new Error(res.detail);
            })
        } else {
            return res.json();
        }
    });
    return response;
};

const TicketParametersForm = ({ submitQuery, ticket }) => {
    function handleForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        let formDataJSON = {};

        for (const [key, value] of formData) {
            formDataJSON[key] = value;
        }

        submitQuery(false);

        const response = RequestPOSTExtend(`${origin}/${ticket.route}`, { ...formDataJSON, sender: client });
        toast.promise(response, {
            loading: `Executing ${ticket.label}: ${JSON.stringify(formDataJSON)}`,
            success: `Success ${ticket.label}: ${JSON.stringify(formDataJSON)}`,
            error: (err) => {
                return `${ticket.label}: ${err.toString()}`
            },
        }, toaster_style);
    };

    // console.log(JSON.stringify(ticket));
    if (ticket === null) {
        return <></>;
    }
    if (ticket.value === 'autopilot') {
        return <TicketInterlock ticket={ticket} onExecute={() => { submitQuery(false) }} />;
    }
    return (<>
        <form onSubmit={handleForm}>
            <TicketParametersSelection ticket={ticket} />
            <DefaultButton text="Submit" />
        </form>
    </>);
};

function TicketForm(props) {
    const [selectedTicket, selectTicket] = useState(null);
    return (<>
        <h2>Create a ticket</h2>
        <TicketDropdown onChange={selectTicket} submitQuery={props.submitQuery} />
        <TicketParametersForm ticket={selectedTicket} submitQuery={props.submitQuery} />
    </>);
};

function TicketBlockInside() {
    const [isNew, setNew] = useState(false);
    if (isNew) {
        return <TicketForm submitQuery={setNew} />
    }
    return (
        <div className="newTicketButton">
            <DefaultButton text="+ New Ticket" onClick={() => setNew(true)} />
        </div>);
};

export function TicketBlock() {
    return (
        <div className="ticketblock">
            <TicketBlockInside />
            <Toaster />
        </div>
    );
}