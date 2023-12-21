import { myConfig } from "./config";
import { useState } from "react";
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import './tickets.css';

const submitNotify = () => toast.success('Ticket is registered.');

const options = [
    { value: 'Down', label: '🙅‍♀️ Down Voltage' },
    { value: 'SetVoltage', label: '⚡ Set Voltage' }
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
    if (ticket.value === "SetVoltage") {
        return (<>
            <div className="ticketForm">
                <label htmlFor="target_voltage">Enter voltage, [V]: </label>
                <input type="text" name="target_voltage" id="voltage" required />
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
        // formData.append("ticket", ticket.value);
        for (const [key, value] of formData) {
            formDataJSON[key] = value;
        }
        console.log(`http://${myConfig.host}:${myConfig.port}/set_ticket/${ticket.value}`);
        fetch(`http://${myConfig.host}:${myConfig.port}/set_ticket/${ticket.value}`, {  // Enter your IP address here
            method: 'POST', 
            mode: 'cors', 
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(formDataJSON) // body data type must match "Content-Type" header
        })
        submitQuery(false);
        submitNotify();
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