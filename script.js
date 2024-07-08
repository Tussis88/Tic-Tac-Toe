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
        const printableBoard = board.map(row => row.map(cell => cell.getValue() === 0 ? " " : cell.getValue().getToken()));
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
        if (winCheck()) {
            console.log(`${getCurrentPlayer().getName()} is the winner`);
        }
        switchTurn();
        console.log(`next turn: ${getCurrentPlayer().getName()}`)
    };
    //TODO
    const winCheck = () => {
        const board = gameBoard.getBoard();
        for (let i = 0; i < 3; i++) {
            if (board[i].every(cell => cell.getValue().getToken)) {
                const winner = board[i].every(cell => cell.getValue().getToken() === board[i][0].getValue().getToken());
                return winner;
            }
            const firstCol = board[0][i].getValue().getToken ? board[0][i] : null;
            for (let j = 1; j < 3; j++) {
                if (!firstCol || firstCol.getValue().getToken() !== board[j][i].getValue().getToken()) {
                    return false;
                }
            }
        }
        // const rowWin = board.map(row => {
        //     if (row.every(cell => cell.getValue().getToken)) {
        //         return row.every(cell => cell.getValue().getToken() === row[0].getValue().getToken());
        //     }
        // })

        // return rowWin;
    }

    return { getCurrentPlayer, switchTurn, playRound };
})();

function Cell() {
    let value = 0;
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



// run
gameBoard.reset();
gameControl.playRound([0, 0]);
gameControl.playRound([1, 1]);
gameControl.playRound([0, 1]);
gameControl.playRound([2, 1]);
gameControl.playRound([0, 2]);