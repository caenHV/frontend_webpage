import browserSignature from 'browser-signature';

export const myConfig = {
    development: {
        // origin: "http://192.168.173.217:8000",
        // host: "192.168.173.217:8000",
        origin: "http://localhost:8000", 
        host: "localhost:8000",
        // "localhost", "192.168.173.217", "dq11cmd"
        client: browserSignature().slice(0, 10),
        chart: {
            updatetime: 1000,
            last_minutes: 15,
            idle_seconds: 18000,
        },
        status: {
            updatetime: 5000,
            aborttime: 2000
        }
    },
    production: {
        origin: window.location.origin,
        host: window.location.host,
        client: browserSignature().slice(0, 10),
        chart: {
            updatetime: 1000, // update chart time (in milliseconds)
            last_minutes: 15, // chart time limit
            idle_seconds: 1 * 3600, // after this inactive interval (in seconds) tab goes to a sleep mode
        },
        status: {
            updatetime: 10000, // update status badges time (in milliseconds)
            aborttime: 2000, // abort API status request time (in milliseconds) [set failed status badge if answer not received before aborttime]
        }
    }
}