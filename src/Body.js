import { ChartBlock } from "./Charts";
import { TicketBlock } from "./Tickets";
import './body.css';

export function Body() {
    return (
        <div className="body">
            <TicketBlock />
            {/* <ChartBlock /> */}
        </div>
    );
}