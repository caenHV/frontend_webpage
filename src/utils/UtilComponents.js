export const DefaultButton = ({ text, onClick = () => { } }) => {
    return <button className="button-40" type="submit"
        onClick={() => { onClick(); }}>{text}</button>;
}

export const LoadingSpinner = () => {
    return (<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>);
};