# CellTeacher

Example register/create user script. A captcha will need to be generated as the registration page is loaded. The following script is an example of something which might request that the server generates a captcha.

```javascript
async function getCaptcha() {
    // to generate a captcha, send a get request to the server
    return await sendRequest("/users/register", "GET", {});
    // this will return something that looks like:
    /*
    {
        "captcha":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"150\" height=\"50\" viewBox=\"0,0,150,50\"><path fill=\"#111\" d=\"M55.63 ... a billion svg numbers... 15.64Z\"/><path d=\"M9 40 C77 7,83 16,141 17\" stroke=\"#444\" fill=\"none\"/></svg>",
        
        "captchaId":3
    }
    */
    // you can append the "captcha" property of this returned object to the DOM html where it is visible to the user.
    // This is the actual captcha image. captchaId must be stored until the user submits their request to create
    // a user. You could put it in local storage maybe idk
}
```

After the page loads with the captcha, we need to wait for the user to submit their request with the filled in data of the new user.

```javascript

// the submit form button to send a request to the server to create a new user
const butElm = document.querySelector("#submit");
// the text input field containing the new user's name
const userElm = submit.querySelector= document.querySelector("#username");
// the text input field containing the new user's password
const pass1Elm = document.querySelector("#password1");
// the text input field containing confirmation of the new user's password'
const pass2Elm = document.querySelector("#password2");
// the captcha passed to the client by the server when the previous request was made
const capElm = document.querySelector("#captcha");
// the element which will display error responsed from the server to the user
const compElm = document.querySelector("#complainer");
// radio button indicating the new user should be of type teacher
const teachElm = document.querySelector("#typeTeacher");
// radio button indicating the new user should ne of type student 
const studElm = document.querySelector("#typeStudent");

// event listener for when the 'create user' or 'submit' button is clicked
butElm.addEventListener("click", async (e) => {
    // check if the first entered password matches with the confirmation password
    if (pass1Elm.value != pass2Elm.value)
        return compElm.innerText = "Passwords do not match.";
    // check if one of either student or teacher teachboxes are selected
    if (!teachElm.checked && !studElm.checked)
        return compElm.innerText = "Please specify and account type.";
    // create http request with username and password
    const registerAttempt = await register(userElm.value, pass1Elm.value);
    // if the returned response worked (has a status code begining with 2 e.g 201) and the registration was successful
    if ((registerAttempt.status+'').charAt(0) == '2')
        // navigate to some login page
        return window.location = "/users/login";
    // if the captcha fails then the server will respond with 422
    if (registerAttempt.status === 422)
        // navigate to some error page
        return window.location = window.location.origin + "/error?message=Captcha failed, please enter the correct Captcha Code.";
    // any other error response with be added to the complainer element
    compElm.innerText = await registerAttempt.text();
})

// register with credentials as the input
async function register(name, password) {
    // send register request
    return sendRequest("/users/register", "POST", {
        // new user's name
        name: name,
        // new user's password
        password: password,
        // user's response to the captcha
        captcha: {
            // the id of the captcha passed by the server to the client during the previous request (see above)
            id: captchaId,
            // the user's response to the captcha
            text: capElm.value
        }
    })
}
```

Logging in looks similar except you don't need password confirmation:

```javascript
// add login event listener
const butElm = document.querySelector("#submit");
const userElm = submit.querySelector= document.querySelector("#username");
const passElm = document.querySelector("#password");
const capElm = document.querySelector("#captcha");
const compElm = document.querySelector("#complainer");

butElm.addEventListener("click", async (e) => {
    const loginAttempt = await login(userElm.value, passElm.value);
    if ((loginAttempt.status+'').charAt(0) == '2')
        return window.location = window.location.origin + "/index";
    if (loginAttempt.status === 422)
        return window.location = window.location.origin + "/error?message=Captcha failed, please enter the correct Captcha Code.";
    compElm.innerText = await loginAttempt.text();
})

// login with the current credentials in the input
async function login(name, password) {
    // send login request
    return sendRequest(window.location.origin + "/users/login", "POST", {
        name: name,
        password: password,
        captcha: {
            id: captchaId,
            text: capElm.value
        }
    })
}
```

There are also several other paths to makes requests to once the user is logged in:

Deleting a user is simple

```javascript
const delElm = document.querySelector("#delete");
const compElm = document.querySelector("#complainer");

delElm.addEventListener("click", async (e) => {
    const deleteAttempt = await deleteAccount(name);
    if ((deleteAttempt.status+'').charAt(0) == '2') {
        // remove cookies added by the server 
        // (essentially logging out the user)
        deleteCookie("name");
        deleteCookie("token");
        // navigate to some main page or maybe login page
        return window.location = window.location.origin + "/index";
    }
    compElm.innerText = await deleteAttempt.text();
})

async function deleteAccount(str) {
    // send register request
    return sendRequest(window.location.origin + "/users/delete", "DELETE");
}
```

If the User is ever not logged in and tries to make a request that requires them to be logged in, the server will repond with an error code of 401 (unauthorized).

Requests to add or remove classes can look like this:
```javascript
sendRequest(window.location.origin + "/classes/delete", "DELETE", {"id":0});
sendRequest(window.location.origin + "/classes/create", "POST", {"name":"Cool Person ICS class"});
```
:') no way to add users to classes yet,
users can only create or delete classes if they are a teacher

Some helper functions:
```javascript
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

// delete the value of a cookie with the given key
function deleteCookie(key) {
    document.cookie = `${key}=; Max-Age=0; path=/; domain=${location.hostname}`;
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
```

