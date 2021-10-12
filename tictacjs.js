/* Tic-Tac Javascript */


// The board is a simple 9-element array of null-for-empty, "X", or "O"
var board;


function initializeBoard() {
    // Initialize board to empty

    board = [null, null, null, null, null, null, null, null, null];
}


function updateBoard() {
    // Update visual game board from board data structure

    for (var i = 0; i < 9; i++) {
        var cell = board[i] || "";
        $("#cell-" + i).text(cell);
    }
}


function isBoardFull(board) {
    // Return true if board is full

    for (var i = 0; i < 9; i++) {
        if (!board[i]) {
            return false;
        }
    }
    return true;
}


function xyToCell(x, y) {
    // Convert 0-based x and y coordinates to cell # 0-8

    return y * 3 + x;
}


function findWinner(board) {
    // Return 'X' or 'O' for winner (or null if no winner yet)

    var cell;

    // horizontal
    for (var rowi = 0; rowi < 3; rowi++) {
        cell = board[xyToCell(0, rowi)];
        if (cell !== null) {
            if ((board[xyToCell(1, rowi)] === cell) &&
                (board[xyToCell(2, rowi)] === cell)) {
                return cell;
            }
        }
    }

    // vertical
    for (var coli = 0; coli < 3; coli++) {
        cell = board[xyToCell(coli, 0)];
        if (cell !== null) {
            if ((board[xyToCell(coli, 1)] === cell) &&
                (board[xyToCell(coli, 2)] === cell)) {
                return cell;
            }
        }
    }

    // diagonal /
    cell = board[4];

    if (cell !== null) {

        if ((board[2] === cell) && (board[6] === cell)) {
            return cell;
        }

        // diagonal \
        if ((board[0] === cell) && (board[8] === cell)) {
            return cell;
        }
    }
}


function placePiece(cellNumber, pieceType) {
    // Place this piece on board
    //
    // Return true if placed (spot was empty); false if not placed (spot already full)

    if (board[cellNumber] === null) {
        board[cellNumber] = pieceType;
        return true;
    }

    return false;
}

let maxDepth = -1;
let nodesMap = new Map();

function getAvailableMoves(board) {
    const moves = []
    board.forEach((cell, index) => {
        if(!cell) moves.push(index);
        
    });
    return moves;
}

function computerMove(board, maximizing = true, callback = () => {}, depth = 0) {
    // Make next possible move for the computer

//   for (var i = 0; i < 9; i++) {
//       if (board[i] === null) {
//           board[i] = "O";
//           return board;
//       }
//   }
    if (depth === 0) {nodesMap.clear()}
    if (findWinner(board) || isBoardFull(board) || depth === maxDepth) {
        if (findWinner(board) === 'O') {
            return -100 + depth;
        } else if (findWinner(board) === 'X') {
            return 100 - depth;
        }
        return 0
    }
    if (maximizing) {
        let best = -100;
        // console.log(`running Max turn at depth ${depth}`)
        getAvailableMoves(board).forEach(index => {
            
                const child = [...board];
                child[index] = 'X';
                const nodeValue = computerMove(child, false, callback, depth + 1);
                

                best = Math.max(best, nodeValue);

                if (depth == 0) {
                    const moves = nodesMap.has(nodeValue) ? `${nodesMap.get(nodeValue)},${index}` : index;
                    nodesMap.set(nodeValue, moves);
                }
            

        });

        if(depth == 0) {
            let returnValue;
            if (typeof nodesMap.get(best) == "string") {
                const arr = nodesMap.get(best).split(',');
                const rand = Math.floor(Math.random() * arr.length);
                returnValue = arr[rand];
            } else {
                returnValue = nodesMap.get(best)
            }
            callback(returnValue)
            return returnValue
        }
        return best;
    }

    if (!maximizing) {
        let best = 100;
        // console.log(`running Min turn at depth ${depth}`)
        getAvailableMoves(board).forEach(index => {
            
                const child = [...board];
                child[index] = 'O';
                // console.log(child)
                const nodeValue = computerMove(child, true, callback, depth + 1);
                

                best = Math.min(best, nodeValue);

                if (depth == 0) {
                    const moves = nodesMap.has(nodeValue)
                        ? nodesMap.get(nodeValue) + "," + index
                        : index;
                    nodesMap.set(nodeValue, moves);
                }
            

        });

        if(depth == 0) {
            let returnValue;
            if (typeof nodesMap.get(best) == "string") {
                const arr = nodesMap.get(best).split(',');
                const rand = Math.floor(Math.random() * arr.length);
                returnValue = arr[rand];
            } else {
                returnValue = nodesMap.get(best)
            }
            console.log(depth)
            callback(returnValue)
            return returnValue
        }
        return best;
    }


}


function checkGameOver(board) {
    // Check if game over, notifying if so. Return true for game over, else false

    var winner = findWinner(board);
    var gameOver = false;

    if (winner) {
        $("h1").text(winner + " Won!");
        gameOver = true;
    }

    else if (isBoardFull(board)) {
        $("h1").text("Tie!");
        gameOver = true;
    }

    if (gameOver) {
        // If game is over, no longer respond to board clicks
        $("#game-board td").off("click");
    }

    return gameOver;
}



function makeHumanMove(cellNumber) {
    // Make human move -- place X in the given 0-8 cell number
    // if piece wasn't place, ignore this move
    //   - update the board
    //   - if the game isn't over
    //     - make computer move
    //     - update board
    //     - check if game is over

    if (placePiece(cellNumber, "X")) {
        updateBoard();

        if (! checkGameOver(board)) {
            console.log(board)
            computerMove(board, false, best => {board[best] = 'O'; console.log(best)})
            console.log(nodesMap)
        //   board[computerMove(board, false)] = 'O';
            updateBoard();
            checkGameOver(board)
        }
    }
}


function handleClick(evt) {
    // Handle a click from the user -- play a round of the game

    var cell = evt.currentTarget;
    makeHumanMove(parseInt(cell.id[5]));
}


function startGame(evt) {
    // Handle start-game button

    initializeBoard();

    // Allow clicks on game board
    $('#game-board td').on('click', handleClick);

    // Remove start-game button
    $(this).remove();
}


$("#start-game").on("click", startGame);