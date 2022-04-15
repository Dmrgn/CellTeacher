// get the value of a cookie with the given key
function getCookieValue(key) {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${key}=`));
    if (cookieValue === undefined)
        return false;
    return cookieValue.split('=')[1];
}

// set the value of a cookie with the given key and value
function setCookieValue(key, value) {
    document.cookie = `${key}=${value}; Secure`;
}

// send an http request to the specified url with the specified method (GET POST etc.)
// passing the data parameter as the request body in the json format
async function sendRequest(url, method, data) {
    const response = await fetch(url, {
        method: method, // GET POST or 'PUT' etc.
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    return response;
}
