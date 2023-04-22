var board = [];
var rows = 8;
var columns = 8;

var minesCount = 10;
var minesLocation = []; // "2-2", "3-4", "2-1"

var tilesClicked = 0; //goal to click all tiles except the ones containing mines
var flagEnabled = false;

var gameOver = false;
var gameState = [];
var gameStateIndex = -1;
var bomb="💣"
var flag ='🚩'



window.onload = function() {
    startGame();
    
}

function saveState() {
    // save a snapshot of the current game state
    var state = {
      board: board.map(row => row.map(tile => ({ id: tile.id, text: tile.innerText, classes: [...tile.classList] }))),
      tilesClicked: tilesClicked,
      gameOver: gameOver
    };
    gameState.push(state);
    gameStateIndex++;
  }

  function clearFutureStates() {
    gameState.splice(gameStateIndex + 1);
  }
  
  function undo() {
    if (gameStateIndex < 0) {
      // no more states to undo
      return;
    }
    var state = gameState[gameStateIndex];
    board.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        var savedTile = state.board[rowIndex][colIndex];
        tile.innerText = savedTile.text;
        tile.className = savedTile.classes.join(' ');
      });
    });
    tilesClicked = state.tilesClicked;
    gameOver = state.gameOver;
    clearFutureStates();
    gameStateIndex--;
    
  }

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}