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
