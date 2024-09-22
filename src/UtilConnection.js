export const RequestPOST = (apiroute, payload) => {
    const fetch_obj = fetch(apiroute, {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(payload),
    });
    return fetch_obj;
};

export const RequestGET = (apiroute, payload) => {
    const request = `${apiroute}?` + new URLSearchParams(payload).toString();
    const fetch_obj = fetch(request);
    return fetch_obj;
};