const gameBoard = (function () {
  const board = [];
  const rows = 3;
  const cols = 3;

  // row 0 = top; col 0 = left
  const reset = () => {
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

  return { getBoard, printBoard, addToken, reset };
})();

const gameControl = (function () {
  const player1 = createPlayer("player 1", "O");
  const player2 = createPlayer("player 2", "X");
  let currentPlayer = player1;

  const getCurrentPlayer = () => currentPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };
  const playRound = (cell) => {
    console.log(`${getCurrentPlayer().getName()}'s turn.`);
    gameBoard.addToken(cell, getCurrentPlayer());
    gameBoard.printBoard();
    if (winCheck()) {
      console.log(`${getCurrentPlayer().getName()} is the winner`);
    }
    switchTurn();
    console.log(`next turn: ${getCurrentPlayer().getName()}`);
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

  return { getCurrentPlayer, switchTurn, playRound, winCheck };
})();

function Cell() {
  let value = 0;
  const addTokenInCell = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addTokenInCell, getValue };
}

function createPlayer(inputName, tokenType) {
  const name = inputName;
  let points = 0;
  const token = tokenType;

  const getName = () => name;
  const getToken = () => token;
  const getPoints = () => points;
  const setPoints = () => points++;
  return { getName, getPoints, getToken, setPoints };
}

const DomLogic = (function () {
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const UpdateScreen = () => {
    boardDiv.textContent = "";
    const board = gameBoard.getBoard();
    const activePlayer = gameControl.getCurrentPlayer();

    playerTurnDiv.textContent = `${activePlayer}'s turn`;
  }
})();

///////////////
// run
console.log("prova row");
gameBoard.reset();
gameControl.playRound([1, 0]);
gameControl.playRound([0, 1]);
gameControl.playRound([1, 1]);
gameControl.playRound([2, 1]);
gameControl.playRound([1, 2]);
gameControl.playRound([0, 0]);

gameBoard.reset();
console.log("prova col");
gameControl.playRound([1, 1]);
gameControl.playRound([1, 2]);
gameControl.playRound([0, 0]);
gameControl.playRound([0, 2]);
gameControl.playRound([2, 0]);
gameControl.playRound([2, 2]);

gameBoard.reset();
console.log("prova diagonale");
gameControl.playRound([0, 0]);
gameControl.playRound([0, 1]);
gameControl.playRound([1, 1]);
gameControl.playRound([2, 0]);
gameControl.playRound([2, 2]);
