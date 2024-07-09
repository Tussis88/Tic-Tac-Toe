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
        let win = false;
        for (let i = 0; i < 3; i++) {
            // check row wins
            if (board[i].every(cell => cell.getValue().getToken)) {
                if (board[i].every(cell => cell.getValue().getToken() === board[i][0].getValue().getToken())) win = true;
            }
            // check col wins
            const firstCol = board[0][i].getValue().getToken ? board[0][i] : null;
            if (firstCol && board[1][i].getValue().getToken && firstCol.getValue().getToken() === board[1][i].getValue().getToken()) {
                if (board[2][i].getValue().getToken) {
                    if (firstCol.getValue().getToken() === board[2][i].getValue().getToken()) win = true;
                }
            }
        }
        // check diagonal wins
        const l1 = board[0][0].getValue().getToken ? board[0][0].getValue().getToken() : null;
        const center = board[1][1].getValue().getToken ? board[1][1].getValue().getToken() : null;
        const r3 = board[2][2].getValue().getToken ? board[2][2].getValue().getToken() : null;
        const r1 = board[0][2].getValue().getToken ? board[0][2].getValue().getToken() : null;
        const l3 = board[2][0].getValue().getToken ? board[2][0].getValue().getToken() : null;

        if (l1 && center && r3) {
            if (l1 === center && l1 === r3) win = true;
        }

        if (r1 && center && l3) {
            if (r1 === center && r1 === l3) win = true;
        }

        return win;
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
console.log("prova row")
gameBoard.reset();
gameControl.playRound([1, 0]);
gameControl.playRound([0, 1]);
gameControl.playRound([1, 1]);
gameControl.playRound([2, 1]);
gameControl.playRound([1, 2]);
gameControl.playRound([0, 0]);

gameBoard.reset();
console.log("prova col")
gameControl.playRound([1, 1]);
gameControl.playRound([1, 2]);
gameControl.playRound([0, 0]);
gameControl.playRound([0, 2]);
gameControl.playRound([2, 0]);
gameControl.playRound([2, 2]);

gameBoard.reset();
console.log("prova diagonale")
gameControl.playRound([0, 0]);
gameControl.playRound([0, 1]);
gameControl.playRound([1, 1]);
gameControl.playRound([2, 0]);
gameControl.playRound([2, 2]);