const delElm = document.querySelector("#delete");
const compElm = document.querySelector("#complainer");

delElm.addEventListener("click", async (e) => {
    const deleteAttempt = await deleteAccount(name);
    if ((deleteAttempt.status+'').charAt(0) == '2') {
        deleteCookie("name");
        deleteCookie("token");
        return window.location = window.location.origin + "/index";
    }
    compElm.innerText = await deleteAttempt.text();
})

async function deleteAccount(str) {
    // send register request
    return sendRequest(window.location.origin + "/users/delete", "GET");
}