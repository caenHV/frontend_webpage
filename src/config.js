
export const myConfig = {
    host: window.location.hostname, // "localhost", "192.168.173.217", "dq11cmd"
    port: "8000",
    chart: {
        updatetime: 1000, // update chart time (in milliseconds)
        last_minutes: 15, // chart time limit
        idle_seconds: 24 * 3600, // after this inactive interval (in seconds) charts will not to be updated
    }
};
