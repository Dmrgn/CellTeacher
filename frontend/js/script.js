const scriptElm = document.querySelector("textarea");
const scriptNameElm = document.querySelector("#scriptName");
const descElm = document.querySelector("#description");
let scriptFocused = false;

scriptElm.addEventListener("blur", function() {
    scriptFocused = false;
});
scriptElm.addEventListener("focus", function() {
    scriptFocused = true;
});

function updateUI() {
    scriptNameElm.innerText = types[currCell];
    console.log(`color: rgb(${red(cols[currCell])},${green(cols[currCell])},${blue(cols[currCell])});`);
    scriptNameElm.style = `color: rgb(${red(cols[currCell])},${green(cols[currCell])},${blue(cols[currCell])}); text-shadow: 2px 2px 10px #ffffff;`;
    console.log(scriptNameElm.style.color);
    descElm.innerText = "This is a cool cell.";
}