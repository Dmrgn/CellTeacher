// add login event listener
const butElm = document.querySelector("#submit");
const userElm = submit.querySelector= document.querySelector("#username");
const passElm = document.querySelector("#password");
const compElm = document.querySelector("#complainer");

butElm.addEventListener("click", async (e) => {
    const loginAttempt = await login(userElm.value, passElm.value);
    if ((loginAttempt.status+'').charAt(0) == '2') {
        window.location = window.location.origin + "/index";
    } else {
        compElm.innerHTML = await loginAttempt.text();
    }
})

// login with the current credentials in the input
async function login(name, password) {
    // send login request
    return sendRequest(window.location.origin + "/users/login", "POST", {
        name: name,
        password: password
    })
}