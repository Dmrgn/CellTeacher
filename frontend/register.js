// the submit form button to send a request to the server to create a new user
const butElm = document.querySelector("#submit");
// the text input field containing the new user's name
const userElm = document.querySelector("#email");
// the text input field containing the new user's password
const pass1Elm = document.querySelector("#password1");
// the text input field containing confirmation of the new user's password'
const pass2Elm = document.querySelector("#password2");
const fNameElm = document.querySelector("#firstname");
const lNameElm = document.querySelector("#lastname");
// the captcha passed to the client by the server when the previous request was made
const capElm = document.querySelector("#captchaText");
// the element which will display error responsed from the server to the user
const compElm = document.querySelector("#complainer");
// radio button indicating the new user should be of type teacher
const teachElm = document.querySelector("#typeTeacher");
// radio button indicating the new user should ne of type student 
const studElm = document.querySelector("#typeStudent");

// event listener for when the 'create user' or 'submit' button is clicked
butElm.addEventListener("click", async (e) => {
    console.log('listening');
    // check if the first entered password matches with the confirmation password
    if (pass1Elm.value != pass2Elm.value)
        //return compElm.innerText = "Passwords do not match.";
        alert("Passwords do not match.");
    // check if one of either student or teacher teachboxes are selected
    if (!teachElm.checked && !studElm.checked)
        return compElm.innerText = "Please specify and account type.";
    // create http request with username and password
    const registerAttempt = await register(userElm.value, pass1Elm.value);
    // if the returned response worked (has a status code begining with 2 e.g 201) and the registration was successful
    if ((registerAttempt.status+'').charAt(0) == '2')
        // navigate to some login page
        return window.location = "https://cellteacher.herokuapp.com/users/login";
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
    return sendRequest("https://cellteacher.herokuapp.com/users/register", "POST", {
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