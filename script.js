const gameBoard = (function () {
    const board = [];
    const rows = 3;
    const cols = 3;

    // row 0 = top; col 0 = left
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let i = 0; i < cols; i++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => console.table(board);

    return { getBoard, printBoard };
})();

function createPlayer(inputName) {
    const name = inputName;
    let points = 0;
    return { name, points };
}