import { ChartBlock } from "./Charts";
import { TicketBlock } from "./Tickets";
import { StatusBlock } from "./Status";
import './body.css';

export function Body() {
    return (
        <div className="body">
            <TicketBlock />
            <ChartBlock />
            <StatusBlock />
        </div>
    );
}