const gameBoard = (function () {
  const board = [];
  const rows = 3;
  const cols = 3;

  // row 0 = top; col 0 = left
  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i].push(Cell());
      }
    }
  };

  const getBoard = () => board;

  const printBoard = () => {
    const printableBoard = board.map((row) =>
      row.map((cell) =>
        cell.getValue() === 0 ? " " : cell.getValue().getToken(),
      ),
    );
    console.table(printableBoard);
  };

  const addToken = (cell, player) => {
    const [row, col] = cell;
    board[row][col].addTokenInCell(player);
  };

  return { getBoard, printBoard, addToken, resetBoard };
})();

const gameControl = (function () {
  const player1 = createPlayer("O");
  const player2 = createPlayer("X");
  let isWon = false;
  let currentPlayer = player1;

  const getCurrentPlayer = () => currentPlayer;
  const getIsWon = () => isWon;
  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;
  const reset = () => {
    currentPlayer = player1;
    gameBoard.resetBoard();
    isWon = false;
  };

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };
  const playRound = (cell) => {
    // console.log(`${getCurrentPlayer().getName()}'s turn.`);
    const [row, col] = cell;
    const board = gameBoard.getBoard();

    if (board[row][col].getValue().getToken || isWon) return;
    gameBoard.addToken(cell, getCurrentPlayer());
    // gameBoard.printBoard();
    if (winCheck()) {
      currentPlayer.setPoints();
      isWon = true;
      return;
    }
    switchTurn();
    // console.log(`next turn: ${getCurrentPlayer().getName()}`);
  };

  const winCheck = () => {
    const board = gameBoard.getBoard();
    const allEqual = (boardPart) => {
      if (boardPart.every((cell) => cell.getValue().getToken)) {
        return boardPart.every(
          (cell) =>
            cell.getValue().getToken() === boardPart[0].getValue().getToken(),
        );
      }
      return false;
    };

    for (let i = 0; i < 3; i++) {
      // rows
      if (allEqual(board[i])) return true;
      // cols
      if (allEqual(board.map((row) => row[i]))) return true;
    }

    // diagonals
    const diagonal = board.map((row, index) => row[index]);
    const diagonalOpposit = board.map((row, index) => row[2 - index]);

    if (allEqual(diagonal) || allEqual(diagonalOpposit)) return true;
    return false;
  };

  return {
    getCurrentPlayer,
    getPlayer1,
    getPlayer2,
    reset,
    switchTurn,
    playRound,
    getIsWon,
  };
})();

function Cell() {
  let value = 0;
  const addTokenInCell = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addTokenInCell, getValue };
}

function createPlayer(tokenType) {
  let name = "name";
  let points = 0;
  const token = tokenType;

  const getName = () => name;
  const setName = (newName) => name = newName; 
  const getToken = () => token;
  const getPoints = () => points;
  const setPoints = () => points++;
  return { getName, setName, getPoints, getToken, setPoints };
}

const domLogic = (function () {
  const playerTurnDiv = document.querySelector(".turn");
  const player1Div = document.querySelector(".player1");
  const player2Div = document.querySelector(".player2");
  const boardDiv = document.querySelector(".board");

  const dialogScreen = document.querySelector(".dialog");
  const winnerText = dialogScreen.querySelector(".winner");
  const restartButton = dialogScreen.querySelector(".restart");

  const dialogStart = document.querySelector(".start");
  const startForm = dialogStart.querySelector("form");
  const startButton = dialogStart.querySelector("#start");

  const updateScreen = () => {
    boardDiv.textContent = "";
    const board = gameBoard.getBoard();
    const activePlayer = gameControl.getCurrentPlayer();

    playerTurnDiv.textContent = `${activePlayer.getName()}'s turn`;
    player1Div.textContent = `${gameControl.getPlayer1().getName()}: ${gameControl.getPlayer1().getPoints()}`;
    player2Div.textContent = `${gameControl.getPlayer2().getName()}: ${gameControl.getPlayer2().getPoints()}`;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.coordinates = JSON.stringify([rowIndex, colIndex]);
        cellButton.innerText = cell.getValue().getToken
          ? cell.getValue().getToken()
          : " ";
        boardDiv.appendChild(cellButton);
      });
    });

    if (gameControl.getIsWon()) {
      dialogScreen.showModal();
      winnerText.innerText = `${activePlayer.getName()} wins`;
      restartButton.addEventListener("click", () => {
        gameControl.reset();
        domLogic.updateScreen();
        dialogScreen.close();
      });
    }
  };

  function clickCell(e) {
    const selectedCell = JSON.parse(e.target.dataset.coordinates);
    if (!selectedCell) return;
    console.log(typeof selectedCell);

    gameControl.playRound(selectedCell);
    updateScreen();
  }

  const startMenu = () => {
    startButton.addEventListener("click", (e) => {
      e.preventDefault();
      const p1name = startForm.p1name.value;
      const p2name = startForm.p2name.value;
      gameControl.getPlayer1().setName(p1name);
      gameControl.getPlayer2().setName(p2name);
      dialogStart.close();
      updateScreen();
    });
    dialogStart.showModal();
  };

  boardDiv.addEventListener("click", clickCell);
  return { updateScreen, startMenu };
})();

gameControl.reset();
domLogic.updateScreen();
domLogic.startMenu();
