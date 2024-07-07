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
        const printableBoard = board.map(row => row.map(cell => cell.getValue().getToken ? cell.getValue().getToken() : " "));
        console.table(printableBoard)
    };

    const addToken = (cell, player) => {
        const [row, col] = cell;
        board[row][col].addToken(player);
    }

    return { getBoard, printBoard, addToken, reset };
})();

const gameControl = (function () {
    const player1 = createPlayer("gigi", "O");
    const player2 = createPlayer("io", "X");
    let currentPlayer = player1;

    const getCurrentPlayer = () => currentPlayer;

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
    const playRound = (cell) => {
        console.log(`${getCurrentPlayer().getName()}'s turn.`)
        gameBoard.addToken(cell, getCurrentPlayer());
        gameBoard.printBoard();
        switchTurn();
        console.log(`next turn: ${getCurrentPlayer().getName()}`)
    };

    return { getCurrentPlayer, switchTurn, playRound };
})();

function Cell() {
    let value = "";
    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addToken, getValue };
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