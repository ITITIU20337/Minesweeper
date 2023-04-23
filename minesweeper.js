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


function startGame() {
  document.getElementById("bomb1").addEventListener("click",setBomb1);
  document.getElementById("bomb2").addEventListener("click",setBomb2);
  document.getElementById("bomb3").addEventListener("click",setBomb3);
  document.getElementById("flag1").addEventListener("click",setflag1);
  document.getElementById("flag2").addEventListener("click",setflag2);
  document.getElementById("flag3").addEventListener("click",setflag3);
  document.getElementById("mines-count").innerText = minesCount;
  document.getElementById("flag-button").innerText = flag;
  document.getElementById("flag-button").addEventListener("click", setFlag);
  document.getElementById("undo").addEventListener("click", undo);
  setMines();
 

  //populate our board
  for (let r = 0; r < rows; r++) {
      let row = [];
      for (let c = 0; c < columns; c++) {
          //<div id="0-0"></div>
          let tile = document.createElement("div");
          tile.id = r.toString() + "-" + c.toString();
          tile.addEventListener("click", clickTile);
          document.getElementById("board").append(tile);
          row.push(tile);
      }
      board.push(row);
  }
  saveState();
}

function setFlag() {
  if (flagEnabled) {
      flagEnabled = false;
      document.getElementById("flag-button").style.backgroundColor = "lightgray";
  }
  else {
      flagEnabled = true;
      document.getElementById("flag-button").style.backgroundColor = "darkgray";
  }
}

function clickTile() {
  if (gameOver || this.classList.contains("tile-clicked")) {
      return;
  }

  let tile = this;
  if (!flagEnabled&& tile.innerText == flag) {
      return;
  }
  if (flagEnabled) {
      if (tile.innerText == "") {
          tile.innerText = flag;
          saveState()
      }
      else if (tile.innerText == flag) {
          tile.innerText = "";
          saveState()
      }
      
  }

  else if (minesLocation.includes(tile.id)) {
      // alert("GAME OVER");
      gameOver = true;
      revealMines();
      saveState()
      return;
  }

  else{
  let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  checkMine(r, c);
  saveState()
  }
}