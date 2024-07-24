export const myConfig = {
    development: {
        origin: "http://192.168.173.217:8000", 
        // "localhost", "192.168.173.217", "dq11cmd"
        // (window.location.port ? window.location.port: '80'),
        chart: {
            updatetime: 1000,
            last_minutes: 15,
            idle_seconds: 24 * 3600,
        },
        status: {
            updatetime: 1000,
        }
    },
    production: {
        origin: window.location.origin,
        chart: {
            updatetime: 1000, // update chart time (in milliseconds)
            last_minutes: 15, // chart time limit
            idle_seconds: 24 * 3600, // after this inactive interval (in seconds) charts will not to be updated
        },
        status: {
            updatetime: 10000, // update status badges time (in milliseconds)
        }
    }
}