
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
    const numval = parseFloat(value);
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

const ItemStatus = ({ value }) => {
    const numval = parseInt(value);
    let classname = 'item';

    if (!isNaN(numval) && (numval >= 8 )) {
        classname = `${classname} wrong`;
    }

    return <div className={classname}>{value}</div>
}

function TableRow({ channel, voltage, current, status, classname = "", parsefloat = false }) {
    const className = `item childcontainer ${classname}`;
    const pVoltage = parsefloat ? +parseFloat(voltage).toFixed(0) : voltage;
    const pCurrent = parsefloat ? +parseFloat(current).toFixed(3) : current;
    const pStatus = parsefloat ? parseInt(status) : status;
    return (
        <div className={className}>
            <Item value={<b>{channel}</b>} />
            <Item value={pVoltage} sensitivityDiff={0.01} />
            <Item value={pCurrent} sensitivityDiff={0.01} />
            <ItemStatus value={pStatus} />
        </div>
    );
}

function TableHeaders() {
    return <TableRow
        channel={<b>Channel</b>}
        voltage={<b>Voltage, [V]</b>}
        current={<b>Current, [μA]</b>}
        status={<b>Status</b>}
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
                    <TableRow 
                        key={key} channel={key} voltage={datarows[key].voltage} 
                        current={datarows[key].current} status={datarows[key].status} 
                    parsefloat={true} />)
            }
        </div>
    </>);
}