import browserSignature from 'browser-signature';

export const myConfig = {
    development: {
        origin: "http://192.168.173.217:8000",
        host: "192.168.173.217:8000",
        // origin: "http://localhost:8000", 
        // host: "localhost:8000",
        client: browserSignature().slice(-11, -2),
        chart: {
            updatetime: 1000,
            last_minutes: 30,
            idle_seconds: 3600,
            aborttime: 4000,
        },
        status: {
            updatetime: 5000,
            aborttime: 2000
        }
    },
    production: {
        origin: window.location.origin,
        host: window.location.host,
        client: browserSignature().slice(-11, -2),
        chart: {
            updatetime: 1000, // update chart time (in milliseconds)
            last_minutes: 30, // chart time limit
            idle_seconds: 3600, // after this inactive interval (in seconds) tab goes to a sleep mode
            aborttime: 4000, // abort time for request if monitor is not answered (in milliseconds)
        },
        status: {
            updatetime: 5000, // update status badges time (in milliseconds)
            aborttime: 2000, // abort API status request time (in milliseconds) [set failed status badge if answer not received before aborttime]
        }
    }
}