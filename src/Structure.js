import './structure.css'

export function Grid(props) {
    return (
        <div className='onecol'>
            {props.children}
        </div>
    );
}