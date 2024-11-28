import { useState } from 'react';

import { DefaultButton } from '../utils/UtilComponents';
import styles from './statuscalc.module.css'

const Structure = (props) => {
    return (<div className={styles.structure}>
        {props.children}
    </div>);
};

const Header = () => {
    return (<>
        <h1 className={styles.h1}><a href="/">CAEN Manager</a> / Status explainer</h1>
        <div className={styles.p}>
            <p>This calculator explains the system state depending on
                the numeric status code (according to&nbsp;the&nbsp;CAEN V6533 system documentation)</p>
        </div>
    </>);
};

const SearchForm = ({ getCode }) => {
    return (<form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let payload = {};
        for (const [key, value] of formData) {
            payload[key] = value;
        }
        console.log(JSON.stringify(payload));
        getCode(payload['status_code']);
    }}>
        <div className={styles.ticketForm}>
            <label className={styles.labelTicketInput} htmlFor="status_code">Status value:</label>
            <input className={styles.ticketInput} type="number" placeholder="0" step="1" min="0" max="32768" name="status_code" id="code" required />
            <DefaultButton text="Explain" />
        </div>
    </form>);
};

const status_codes = {
    16: "Channel OFF",
    0: "Channel ON",
    1: "Channel RAMP UP",
    2: "Channel RAMP DOWN",
    3: "Channel OVER CURRENT",
    4: "Channel OVER VOLTAGE",
    5: "Channel UNDER VOLTAGE",
    6: "Channel MAXV",
    7: "Channel MAXI",
    8: "Channel TRIP",
    9: "Channel OVER POWER",
    10: "Channel OVER TEMPERATURE",
    11: "Channel DISABLED",
    12: "Channel INTERLOCK",
    13: "Channel UNCALIBRATED",
    14: "Reserved",
    15: "Reserved",
}

const Explainer = ({ code }) => {
    if (!code) {
        console.log("null")
        return <></>;
    }
    console.log("one")

    const binary_code = Number.parseInt(code).toString(2);
    const statuses = Array.from(binary_code).reverse();


    return (<div className={styles.explainsection}>
        <h1>Explain {code}</h1>
        <div className={styles.explainblock}>
            {statuses.map((bit, idx) => {
                if ((idx === 0) && (bit === "0")) {
                    return <div>{status_codes[16]}</div>
                }
                if (bit === "1") {
                    return <div>{status_codes[idx]}</div>
                }
                return <></>;
            }
            )}
        </div>
    </div>);
};

export default function StatusCalcPage() {
    const [code, setCode] = useState(null)

    return (<Structure>
        <Header />
        <SearchForm getCode={(code) => { setCode(code) }} />
        <Explainer code={code} />
    </Structure>);
}