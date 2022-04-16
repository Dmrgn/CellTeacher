let board;
let cellSize;
let cols;
let xOffset, yOffset;
let currCell;
let dragging;
let generatorFacing, generatorType;
let duplicatorIn, duplicatorOut;
let dirUp, dirLeft, dirDown, dirRight;

function setup() {
  createCanvas(1000, 1000);
  board = Array(100);
  for (let x = 0; x < 100; x++)
    board[x] = Array(100).fill(0);
  cellSize = 10;
  
  cols = [color(223), color(0), color(255,0,0), color(255,255,0), color(0,255,255), color(0,255,0)];
  xOffset = 200;
  yOffset = 0;
  currCell = 1;
  dragging = false;
  
  dirUp = [0, -1];
  dirLeft = [-1, 0];
  dirDown = [0, 1];
  dirRight = [1, 0];
  
  generatorFacing = dirUp;
  generatorType = 2;
  duplicatorIn = dirLeft;
  duplicatorOut = dirRight;
}

function draw() {
  for (let x = 0; x < cols.length; x++) {
    fill(cols[x]);
    rect(0, 200*x, 200, 200);
  }
  mouseMoved();
  board = step(board);
  drawBoard(board);
}

function drawBoard(board) {
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      fill(cols[board[x][y]]);
      rect(xOffset + x*cellSize, yOffset + y*cellSize, cellSize, cellSize);
    }
  }
}

function step(board) {
  // let arr = Array(100);
  // for (let x = 0; x < 100; x++)
  //   arr[x] = Array(100).fill(0);
  let arr = [...board];
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (board[x][y] == 1) continue;
      if (board[x][y] == 3) {
        if (board[x + generatorFacing[0]][y + generatorFacing[1]] == 0)
          arr[x + generatorFacing[0]][y + generatorFacing[1]] = generatorType;
      } else if (board[x][y] == 4) {
        print("dupe in loc " + board[x + duplicatorIn[0]][y + duplicatorIn[1]] + " " + board[x + duplicatorOut[0]][y + duplicatorOut[1]]);
        if ((board[x + duplicatorIn[0]][y + duplicatorIn[1]] > 1) && (board[x + duplicatorOut[0]][y + duplicatorOut[1]] == 0)) {
          arr[x + duplicatorOut[0]][y + duplicatorOut[1]] = board[x + duplicatorIn[0]][y + duplicatorIn[1]];
        }
      }
    }
  }
  return arr;
}

function mousePressed() {
  dragging = true;
}

function mouseReleased() {
  dragging = false;
}

function mouseMoved() {
  if (!dragging) return;
  if (mouseX < 200) {
    currCell = int(mouseY/200);
    print(currCell);
  } else if (mouseX <= 1000 && mouseY <= 1000) {
    board[int((mouseX - xOffset)/cellSize)][int((mouseY - yOffset)/cellSize)] = currCell;
  }
}
