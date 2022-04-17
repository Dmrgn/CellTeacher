let cameraPos;
let nextCameraPos;
let zoom = 1;
const maxZoom = 3;
const minZoom = 1;
let dragged = false;

function mouseWheel(e) {
    amount = e.deltaY > 0 ? 0.95 : 1.05;
    zoomCamera(mouseX, mouseY, amount);
}

function mouseWheel(e) {
    amount = e.deltaY > 0 ? 0.95 : 1.05;
    zoomCamera(mouseX, mouseY, amount);
}

function initCamera() {
    document.addEventListener('contextmenu', event => event.preventDefault());
    cameraPos = createVector(0,0);
    nextCameraPos = createVector(0,0);
}
function panCamera(x, y) {
    nextCameraPos.add(x, y);
}
function moveCamera(x, y) {
    cameraPos.add(x, y);
    nextCameraPos.set(cameraPos);
}
function zoomCamera(x, y, amount) {
    zoom *= amount;
    if (zoom > maxZoom || zoom < minZoom) {
        zoom = max(minZoom, min(zoom, maxZoom));
        return false;
    }
    cameraPos.x = x * (1-amount) + cameraPos.x * amount;
    cameraPos.y = y * (1-amount) + cameraPos.y * amount;
    nextCameraPos.set(cameraPos);
}
function startCamera() {
    // move camera closer to intended position
    cameraPos.add((nextCameraPos.x-cameraPos.x)/10, (nextCameraPos.y-cameraPos.y)/10);
    // add camera controls
    if (dragged && mouseButton === RIGHT) {
        moveCamera(mouseX-pmouseX,mouseY-pmouseY);
    }
    push();
    translate(cameraPos.x, cameraPos.y);
    scale(zoom);
}
function stopCamera() {
    pop();
}