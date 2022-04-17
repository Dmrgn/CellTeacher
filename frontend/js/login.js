// add login event listener
const butElm = document.querySelector("#submit");
const userElm = document.querySelector("#username");
const passElm = document.querySelector("#password");
const capElm = document.querySelector("#captcha");
const compElm = document.querySelector("#complainer");
const captchaElm = document.querySelector("#captchaImg");

// id of the generated captcha
let captchaId = null;

// get a captcha when the page loads
// getCaptcha was moved to utils.js
getCaptcha().then(data => {
    data.json().then(json => {
        captchaElm.innerHTML = json.captcha;
        captchaId = json.captchaId;
    })
});

butElm.addEventListener("click", async (e) => {
    const loginAttempt = await login(userElm.value, passElm.value);
    if ((loginAttempt.status+'').charAt(0) == '2')
        //return window.location = "https://cellteacher.herokuapp.com/users/index";
        //return window.location = window.location.origin + "/teacherpanel.html";
        return window.open("teacherpanel.html");
    if (loginAttempt.status === 422)
        return window.location = window.location.origin + "/error?message=Captcha failed, please enter the correct Captcha Code.";
    compElm.innerText = await loginAttempt.text();
})

// login with the current credentials in the input
async function login(name, password) {
    // send login request
    return sendRequest("https://cellteacher.herokuapp.com/users/login", "POST", {
        name: name,
        password: password,
        captcha: {
            id: captchaId,
            text: capElm.value
        }
    })
}