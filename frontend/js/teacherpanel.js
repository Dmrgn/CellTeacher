// add teacher panel event listeners
const butElmCreate = document.querySelector("#create");
const className = document.querySelector("#classname")
const compElm = document.querySelector("#complainer");

function showCreateClass() {
    var showClassDiv = document.getElementById("showCreateNewClass");
    if (showClassDiv.style.display === "none") {
        showClassDiv.style.display = "block";
    } else {
        showClassDiv.style.display = "none";
    }
  }

butElmCreate.addEventListener("click", async (e) => {
    if(className.value == null){
        return compElm.innerText = "Please enter a class name.";
    }
    const createClassAttempt = await createClass(className.value);
    compElm.innerText = await createClassAttempt.text();
})

async function createClass(name){
    return sendRequest("https://cellteacher.herokuapp.com/classes/create", "POST", {
        name: name
    })
}