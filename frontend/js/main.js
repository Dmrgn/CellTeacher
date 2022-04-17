let board;
let boardSize;
let cellSize;
let sideBarSize;
let cols;
let play;
let xOffset, yOffset;
let currCell;
let pusherFacing, pusherLimit;
let generatorFacing, generatorType;
let duplicatorIn, duplicatorOut;
let dirUp, dirLeft, dirDown, dirRight;

function setup() {
    frameRate(30);

    boardSize = 60;
    cellSize = 15;
    sideBarSize = 60;

    initCamera();

    const htmlElm = document.querySelector("html");
    createCanvas(htmlElm.clientWidth, htmlElm.clientHeight);
    canvas.style = "display: flex;";
    drawingContext.imageSmoothingEnabled = false;

    moveCamera(width/2-200-cellSize*boardSize/2, height/2-cellSize*boardSize/2);

    board = Array(boardSize);
    for (let x = 0; x < boardSize; x++)
        board[x] = Array(boardSize).fill(0);

    cols = [color(223), color(0), color(165, 114, 63), color(255, 255, 0), color(0, 255, 255), color(255, 0, 255), color(0, 255, 0)];
    xOffset = 200;
    yOffset = 0;
    currCell = 1;

    dirUp = [0, -1];
    dirLeft = [-1, 0];
    dirDown = [0, 1];
    dirRight = [1, 0];

    pusherFacing = dirLeft;
    pusherLimit = 3;
    generatorFacing = dirUp;
    generatorType = 2;
    duplicatorIn = dirDown;
    duplicatorOut = dirUp;

    play = false;
}

function keyTyped() {
    if (key === ' ') {
        play = !play;
    }
}

function draw() {
    background("white");
    
    startCamera();

    drawBoard(board);

    stopCamera();

    for (let x = 0; x < cols.length; x++) {
        fill(cols[x]);
        rect(0, sideBarSize * x, 200, sideBarSize);
    }
    fill(play ? color(0, 255, 0) : color(255, 0, 0));
    rect(75, 500, 50, 50);
    if (play && frameCount%6 === 0) {
        board = step(board);
    }
}

function drawBoard(board) {
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            fill(cols[board[x][y]]);
            rect(xOffset + x * cellSize, yOffset + y * cellSize, cellSize, cellSize);
        }
    }
}

function step(board) {
    let arr = Array(boardSize);
    for (let x = 0; x < boardSize; x++)
        arr[x] = board[x].slice();
  
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {

            // pusher cell
            if (board[x][y] == 3) {
                let move = 0;
                for (; move <= pusherLimit; move++) {

                    // checking if within bounds
                    if (x + (move + 1)*pusherFacing[0] >= boardSize 
                    || x + (move + 1)*pusherFacing[0] < 0 
                    || y + (move + 1)*pusherFacing[1] >= boardSize 
                    || y + (move + 1)*pusherFacing[1] < 0 
                    || x + (move - 1)*pusherFacing[0] >= boardSize 
                    || x + (move - 1)*pusherFacing[0] < 0 
                    || y + (move - 1)*pusherFacing[1] >= boardSize
                    || y + (move - 1)*pusherFacing[1] < 0) break;

                    // checking for empty space
                    if (board[x + (move + 1)*pusherFacing[0]][y + (move + 1)*pusherFacing[1]] == 0
                     || board[x + (move + 1)*pusherFacing[0]][y + (move + 1)*pusherFacing[1]] == 3
                     || board[x + (move + 1)*pusherFacing[0]][y + (move + 1)*pusherFacing[1]] == 6) {
                        move++;
                        break;
                    }
                    
                    // checking for wall or block push limit
                    if (board[x + (move + 1)*pusherFacing[0]][y + (move + 1)*pusherFacing[1]] == 1 || move == pusherLimit) {
                        move = 0;
                        break;
                    }
                }
                for (let i = 0; i < move; i++) {
                    if (x + (i + 1)*pusherFacing[0] >= boardSize 
                    || y + (i + 1)*pusherFacing[1] >= boardSize 
                    || x + (i - 1)*pusherFacing[0] >= boardSize 
                    || y + (i - 1)*pusherFacing[1] >= boardSize) break;

                    arr[x + (i + 1)*pusherFacing[0]][y + (i + 1)*pusherFacing[1]] = board[x + i*pusherFacing[0]][y + i*pusherFacing[1]];
                    arr[x + i*pusherFacing[0]][y + i*pusherFacing[1]] = board[x + (i - 1)*pusherFacing[0]][y + (i - 1)*pusherFacing[1]];
                }
                if (move > 0) arr[x][y] = 0;
            }
        }
    }
    board, arr = checkGoals(board, arr);
    for (let x = 0; x < boardSize; x++)
        board[x] = arr[x].slice();
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {

            // generator cell
            if (board[x][y] == 4) {
                if (board[x + generatorFacing[0]][y + generatorFacing[1]] == 0)
                    arr[x + generatorFacing[0]][y + generatorFacing[1]] = generatorType;

            // duplicator cell
            } else if (board[x][y] == 5) {
                if (x + duplicatorIn[0] >= 0 && y + duplicatorIn[1] >= 0 && x + duplicatorOut[0] < boardSize && y + duplicatorOut[1] < boardSize)
                    if ((board[x + duplicatorIn[0]][y + duplicatorIn[1]] > 1) && (board[x + duplicatorOut[0]][y + duplicatorOut[1]] == 0))
                        arr[x + duplicatorOut[0]][y + duplicatorOut[1]] = board[x + duplicatorIn[0]][y + duplicatorIn[1]];
            }
        }
    }
    return arr;
}

function checkGoals(b, a) {
    for (let x = 0; x < b.length; x++) {
        for (let y = 0; y < b[x].length; y++) {
            if (b[x][y] == 6 && a[x][y] > 1) {
                b[x][y] = 0;
                a[x][y] = 0;
            }
        }
    }
    return b, a;
}

function mouseClicked() {
    mouseDragged();
}

function mouseDragged() {
    dragged = true;
    const mouseTileX = Math.floor((mouseX - cameraPos.x)/zoom);
    const mouseTileY = Math.floor((mouseY - cameraPos.y)/zoom);
    if (mouseButton === LEFT) {
        if (mouseX < 200) {
            if (mouseY < sideBarSize * cols.length) {
                currCell = int(mouseY / sideBarSize);
                print(currCell);
            }
        } else if (mouseTileX >= 200 && mouseTileX <= boardSize*cellSize + 200 && mouseTileY <= boardSize*cellSize) {
            board[int((mouseTileX - xOffset) / cellSize)][int((mouseTileY - yOffset) / cellSize)] = currCell;
        }
    }
}

function mouseReleased() {
    dragged = false;
}
