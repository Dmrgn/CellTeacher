// add register event listener
const butElm = document.querySelector("#submit");
const userElm = submit.querySelector= document.querySelector("#username");
const pass1Elm = document.querySelector("#password1");
const pass2Elm = document.querySelector("#password2");
const compElm = document.querySelector("#complainer");

butElm.addEventListener("click", async (e) => {
    if (pass1Elm.value != pass2Elm.value)
        return compElm.innerText = "Passwords do not match.";
    const registerAttempt = await register(userElm.value, pass1Elm.value);
    if ((registerAttempt.status+'').charAt(0) == '2') {
        window.location = window.location.origin + "/users/login";
    } else {
        compElm.innerText = await registerAttempt.text();
    }
})

// register with the current credentials in the input
async function register(name, password) {
    // send register request
    return sendRequest(window.location.origin + "/users/register", "POST", {
        name: name,
        password: password
    })
}