// add register event listener
const butElm = document.querySelector("#submit");
const userElm = submit.querySelector= document.querySelector("#username");
const pass1Elm = document.querySelector("#password1");
const pass2Elm = document.querySelector("#password2");
const capElm = document.querySelector("#captcha");
const compElm = document.querySelector("#complainer");
const teachElm = document.querySelector("#typeTeacher");
const studElm = document.querySelector("#typeStudent");


butElm.addEventListener("click", async (e) => {
    if (pass1Elm.value != pass2Elm.value)
        return compElm.innerText = "Passwords do not match.";
    if (!teachElm.checked && !studElm.checked)
        return compElm.innerText = "Please specify and account type.";
    const registerAttempt = await register(userElm.value, pass1Elm.value);
    if ((registerAttempt.status+'').charAt(0) == '2')
        return window.location = window.location.origin + "/users/login";
    if (registerAttempt.status === 422)
        return window.location = window.location.origin + "/error?message=Captcha failed, please enter the correct Captcha Code.";
    compElm.innerText = await registerAttempt.text();
})

// register with the current credentials as the input
async function register(name, password) {
    // send register request
    return sendRequest(window.location.origin + "/users/register", "POST", {
        name: name,
        password: password,
        captcha: {
            id: captchaId,
            text: capElm.value
        }
    })
}