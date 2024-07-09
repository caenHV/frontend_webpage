import { myConfig } from "./config";
import { useState } from "react";
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import './tickets.css';

const submitNotify = () => toast.success('Ticket is registered.');
const successNotify = () => toast.success('Well done!');

const options = [
    { value: 'down', label: '🙅‍♀️ Down Voltage' },
    { value: 'set_voltage', label: '⚡ Set Voltage' }
]

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
                <input className="ticketInput" type="number" placeholder="1.0" step="0.01" min="0" max="1.1" name="target_voltage" id="voltage" required />
            </div>
        </>);
    }
    return (<></>);
};

const TicketParametersForm = ({ submitQuery, ticket }) => {
    function handleForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        let formDataJSON = {};

        for (const [key, value] of formData) {
            formDataJSON[key] = value;
        }

        // submitNotify();
        submitQuery(false);

        const response = fetch(`http://${myConfig.host}:${myConfig.port}/device_backend/${ticket.value}`, {  // Enter your IP address here
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(formDataJSON) // body data type must match "Content-Type" header
        });
        toast.promise(response, {
            loading: `Executing ${ticket.label}: ${JSON.stringify(formDataJSON)}`,
            success: `Success ${ticket.label}: ${JSON.stringify(formDataJSON)}`,
            error: `Error ${ticket.label}: ${JSON.stringify(formDataJSON)}`,
        }, {
            style: {
                fontSize: '18px',
            },
        });
    };

    if (ticket === null) {
        return <></>;
    }
    return (<>
        <form onSubmit={handleForm}>
            <TicketParametersSelection ticket={ticket} />
            <button className={"button-40"} type="submit">Submit</button>
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
            <button className={"button-40"} onClick={() => setNew(true)}>+ New Ticket</button>
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