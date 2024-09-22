
import { useRef, useEffect } from 'react'
import './table.css'


const usePreviousValue = value => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

const Item = ({ value, sensitivityDiff = 0 }) => {
    const numval = parseInt(value);
    const prevVal = usePreviousValue(numval);
    let classname = 'item';

    // console.log(value, numval, prevVal)
    if (!isNaN(numval) && (numval > prevVal * (1 + sensitivityDiff))) {
        classname = `${classname} rc-higher`
    }
    if (!isNaN(numval) && (numval < prevVal * (1 - sensitivityDiff))) {
        classname = `${classname} rc-lower`
    }

    return <div className={classname}>{value}</div>
}

function TableRow({ channel, voltage, current, classname="" }) {
    const className = `item childcontainer ${classname}`;
    return (
        <div className={className}>
            <Item value={<b>{channel}</b>} />
            <Item value={voltage} sensitivityDiff={0.01}/>
            <Item value={current} sensitivityDiff={0.01}/>
        </div>
    );
}

function TableHeaders() {
    return <TableRow
        channel={<b>Channel</b>}
        voltage={<b>Voltage, [V]</b>}
        current={<b>Current, [μA]</b>}
        classname="header"
    />
}

export function SystemStateTable({ datarows }) {
    // console.log(JSON.stringify(datarows));

    // Do not draw table if empty
    if (Object.keys(datarows).length === 0) {
        return <></>;
    }

    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    return (<>
        <div className='container'>
            <TableHeaders />
            {

                Object.keys(datarows).sort(collator.compare).map((key) =>
                    <TableRow key={key}
                        channel={key} voltage={datarows[key].voltage} current={datarows[key].current} />)
            }
        </div>
    </>);
}