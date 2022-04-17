const scriptElm = document.querySelector("textarea");
let scriptFocused = false;

scriptElm.addEventListener("blur", function() {
    scriptFocused = false;
});
scriptElm.addEventListener("focus", function() {
    scriptFocused = true;
});

