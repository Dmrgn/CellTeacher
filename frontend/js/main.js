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

var levels = [
    [
        7, // board size
        100, // cell size
        [0, 1, 2, 6], // buildArea
        [
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 6, 6, 6, 0, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ]
    ],
    [
        7, // board size
        100, // cell size
        [0, 0, 2, 2], // buildArea
        [
            [0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 6, 6, 1],
            [0, 0, 0, 0, 6, 6, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ]
    ],
    [
        15, // board size
        50, // cell size
        [0, 0, 15, 15], // buildArea
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    ],
]

function setup() {
    frameRate(30);

    initCamera();

    const htmlElm = document.querySelector("html");
    const mainElm = document.querySelector("main");
    mainElm.classList.add("is-flex-grow-3");
    createCanvas(htmlElm.clientWidth/3*2, htmlElm.clientHeight);
    canvas.style = "display: flex;";
    drawingContext.imageSmoothingEnabled = false;
}

function levelSetup(lev) {
    levelData = await sendRequest(("https://cellteacher.herokuapp.com/levels/" + String(lev)), "GET");

    boardSize = levelData.boardSize;
    cellSize = Math.round(Math.min(htmlElm.clientHeight, htmlElm.clientWidth)/boardSize);
    sideBarSize = 200;
    sideBarHeight = 60;
    buildArea = levelData.buildArea;

    moveCamera(width/2-200-cellSize*boardSize/2, height/2-cellSize*boardSize/2);

    types = ["Blank", "Wall", "Moveable", "Pusher", "Generator", "Duplicator", "Goal"];

    // board = Array(boardSize);
    // for (let x = 0; x < boardSize; x++)
    //     board[x] = levels[lev][3].slice();

    cols = [color(223), color(0), color(165, 114, 63), color(255, 255, 0), color(0, 255, 255), color(255, 0, 255), color(0, 255, 0)];
    xOffset = 200;
    yOffset = 0;
    currCell = 1;

    dirUp = [0, -1];
    dirLeft = [-1, 0];
    dirDown = [0, 1];
    dirRight = [1, 0];

    pusherFacing = dirUp;
    pusherLimit = 3;
    generatorFacing = dirUp;
    generatorType = 2;
    duplicatorIn = dirDown;
    duplicatorOut = dirUp;

    play = false;
}

function keyTyped() {
    if (key === ' ' && !scriptFocused) {
        play = !play;
    }
}

function draw() {
    background("white");

    scriptElm.value = scripts[currCell] ?? "" ;
    console.log(scripts[currCell]);
    
    startCamera();

    drawBoard(board);

    stopCamera();

    for (let x = 0; x < cols.length; x++) {
        fill(cols[x]);
        rect(0, sideBarSize * x, 200, sideBarSize);
    }
    // outline around current cell
    if (currCell >= 0) {
        noFill();
        strokeWeight(10);
        rect(-5, sideBarSize * currCell -5, 210, sideBarSize+10);
        strokeWeight(1);
    }
    fill(play ? color(0, 255, 0) : color(255, 0, 0));
    rect(75, 500, 50, 50);
    if (play && frameCount%6 === 0) {
        board = step(board);
    }
    if (levelComplete(board) && currLevel < levels.length) {
        levelSetup(++currLevel);
    }
    noFill();
    stroke(127);
    strokeWeight(10);
    rect(sideBarSize + buildArea[0]*cellSize, buildArea[1]*cellSize, (buildArea[2]-buildArea[0])*cellSize, (buildArea[3]-buildArea[1])*cellSize);
    stroke(0);
    strokeWeight(2);
}

function levelComplete(board) {
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            if (board[x][y] == 6) return false;
        }
    }
    return true;
}

function drawBoard(board) {
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            fill(cols[board[x][y]]);
            rect(xOffset + x * cellSize, yOffset + y * cellSize, cellSize, cellSize);
        }
    }
}

function moveCell(board, arr, x, y, dir) {
    if (x + dir[0] == 0 || x + dir[0] == 6
     || y + dir[0] == 0 || y + dir[0] == 6)
        arr[x + dir[0]][y + dir[1]] = board[x][y];
    return board, arr;
}


function step(board) {

    let arr = Array(boardSize);
    for (let x = 0; x < boardSize; x++)
        arr[x] = board[x].slice();

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] == 1) {
                console.log(board[i][j]);
                try {
                    eval(scripts[board[i][j]]);
                } catch (error) {}
                console.log(board[i][j]);
            }
        }
    }

    console.log(board);

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            let x = row;
            let y = col;
            if (pusherFacing == dirRight || pusherFacing == dirUp) {
                x = board.length - row - 1;
                y = board.length - col - 1;
            }

            // pusher cell
            if (board[x][y] == 3) {
                let move = 0;
                let adj = 0;
                for (;; move++) {

                    // checking if within bounds
                    if (x + (move - adj + 1)*pusherFacing[0] >= boardSize 
                    || x + (move - adj + 1)*pusherFacing[0] < 0 
                    || y + (move - adj + 1)*pusherFacing[1] >= boardSize 
                    || y + (move - adj + 1)*pusherFacing[1] < 0) break;

                    // checking for empty space
                    if (board[x + (move - adj + 1)*pusherFacing[0]][y + (move - adj + 1)*pusherFacing[1]] == 0
                     || board[x + (move - adj + 1)*pusherFacing[0]][y + (move - adj + 1)*pusherFacing[1]] == 6) {
                        move++;
                        break;
                    }
                    
                    if (board[x + (move - adj + 1)*pusherFacing[0]][y + (move - adj + 1)*pusherFacing[1]] == 3) {
                        move++;
                        adj = move;
                        break;
                    }

                    // checking for wall or block push limit
                    if (board[x + (move - adj + 1)*pusherFacing[0]][y + (move - adj + 1)*pusherFacing[1]] == 1 || move - adj == pusherLimit) {
                        move = 0;
                        break;
                    }
                }
                for (let i = 0; i < move - adj; i++) {
                    if (x + (i + 1)*pusherFacing[0] >= boardSize 
                    || y + (i + 1)*pusherFacing[1] >= boardSize) break;
                    board, arr = moveCell(board, arr, x, y, pusherFacing);
                    // arr[x + (i + 1)*pusherFacing[0]][y + (i + 1)*pusherFacing[1]] = board[x + i*pusherFacing[0]][y + i*pusherFacing[1]];
                    if (x + (i - 1)*pusherFacing[0] < 0
                     || x + (i + 1)*pusherFacing[0] >= boardSize
                     || y + (i - 1)*pusherFacing[1] < 0
                     || y + (i + 1)*pusherFacing[1] >= boardSize)
                        board, arr = moveCell(board, arr, x - pusherFacing[0], y - pusherFacing[1], [-pusherFacing[0], -pusherFacing[1]]);
                    // arr[x + i*pusherFacing[0]][y + i*pusherFacing[1]] = x + (i - 1)*pusherFacing[0] < 0 || x + (i + 1)*pusherFacing[0] >= boardSize || y + (i - 1)*pusherFacing[1] < 0 || y + (i + 1)*pusherFacing[1] >= boardSize ? 0 : board[x + (i - 1)*pusherFacing[0]][y + (i - 1)*pusherFacing[1]];
                }
                if (move - adj > 0) arr[x][y] = 0;
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
                if (board[x + generatorFacing[0]][y + generatorFacing[1]] == 0
                 || board[x + generatorFacing[0]][y + generatorFacing[1]] == 6)
                    arr[x + generatorFacing[0]][y + generatorFacing[1]] = generatorType;

            // duplicator cell
            } else if (board[x][y] == 5) {
                if (x + duplicatorIn[0] >= 0 && y + duplicatorIn[1] >= 0 && x + duplicatorOut[0] < boardSize && y + duplicatorOut[1] < boardSize)
                    if ((board[x + duplicatorIn[0]][y + duplicatorIn[1]] > 1 && board[x + duplicatorIn[0]][y + duplicatorIn[1]] != 6) && (board[x + duplicatorOut[0]][y + duplicatorOut[1]] == 0 || board[x + duplicatorOut[0]][y + duplicatorOut[1]] == 6))
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
            }
        }
    }
    return b, a;
}

function mouseClicked() {
    mouseDragged();
}

function mouseDragged() {

    if (mouseX < 0 || mouseY < 0)
        return;

    dragged = true;
    const mouseTileX = Math.floor((mouseX - cameraPos.x)/zoom);
    const mouseTileY = Math.floor((mouseY - cameraPos.y)/zoom);
    if (mouseButton === LEFT) {
        if (mouseX < sideBarSize) {
            if (mouseY < sideBarHeight * cols.length) {
                currCell = int(mouseY / sideBarHeight);
            }
        } else if (mouseTileX >= Math.floor(sideBarSize/boardSize) && mouseTileX <= boardSize*cellSize + sideBarSize && mouseTileY <= boardSize*cellSize) {
            board[int((mouseTileX - xOffset) / cellSize)][int((mouseTileY - yOffset) / cellSize)] = currCell;
        }
    }
}

function mouseReleased() {
    dragged = false;
}
