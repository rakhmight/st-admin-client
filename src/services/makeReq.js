export default async function makeReq(url = "", method = "GET", data = {}) {
    if(method == 'POST'){
        let body
        try {
            body = JSON.stringify(data);
        } catch (error) {
            console.log(error.message);
        }
    
        const response = await fetch(url, {
            method, // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body, // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    } else if(method=='GET'){
        const response = await fetch(url, {
            method,
            mode: 'cors', // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
        });
        return response
    }
}