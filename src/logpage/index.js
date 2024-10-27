import { useState, useEffect } from 'react';

import { myConfig } from '../config';
import { RequestGET } from '../utils/UtilConnection';
import { LoadingSpinner } from '../utils/UtilComponents';
import styles from './logpage.module.css'

const { origin, client } = myConfig[process.env.REACT_APP_CAEN];

const Structure = (props) => {
    return (<div className={styles.structure}>
        {props.children}
    </div>);
};

const Header = () => {
    return (<>
        <h1 className={styles.h1}><a href="/">CAEN Manager</a> / Last events</h1>
    </>);
};

const LogCols = ({timestamp, message}) => {
    return (<tr>
        <th>{timestamp}</th>
        <th>{message}</th>
    </tr>);
};

const LogRow = ({timestamp, message, is_ok}) => {
    const style = is_ok ? styles.ok_row : styles.fail_row
    return (<tr className={style}>
        <td className={styles.td}>{timestamp}</td>
        <td className={styles.td}>{message}</td>
    </tr>);
};

const PreparedLogRow = ({timestamp, message, importance}) => {
    const date = new Date(timestamp * 1000);
    const date_str = date.toLocaleDateString("ru-RU");
    const time_str = date.toLocaleTimeString("ru-RU");
    return (<LogRow timestamp={`${date_str} ${time_str}`} message={message} is_ok={importance} />);
};

const LogTable = ({data}) => {
    
    const current_date = new Date();
    const date_str = current_date.toLocaleDateString("ru-RU");
    const time_str = current_date.toLocaleTimeString("ru-RU");
    return (<>
    <h3>Table received on {date_str} at {time_str}</h3>
    <table className={styles.table}>
        <thead>
            <LogCols timestamp="Timestamp" message="Message" />
        </thead>
        <tbody>
        {data.map((x, i) =>
            <PreparedLogRow timestamp={x.t} message={x.description} importance={x.is_ok} key={i}/>
        )}
        </tbody>
    </table>
    </>);
}

export default function LogPage() {
    const [data, setData] = useState(<LoadingSpinner />);

    useEffect(() => {
        RequestGET(`${origin}/monitor/logs`, { sender: client }).then(response => (response.json())
        ).then(response => {
            const body = response.response.body;
            setData(<LogTable data={body}/>);
        }).catch(err => {
            setData('Load failed');
        });
    }, []);

    return (<Structure>
        <Header />
        {data}
    </Structure>);
}