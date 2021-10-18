/* Tic-Tac Javascript */



//Initialize variables
var board;
var symbol;
var CPUSymbol;
var maximizing;
let maxDepth = -1;
let nodesMap = new Map();


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
                    let obj = {cell, "direction": `h-${rowi}`}
                    return obj;
            }
        }
    }

    // vertical
    for (var coli = 0; coli < 3; coli++) {
        cell = board[xyToCell(coli, 0)];
        if (cell !== null) {
            if ((board[xyToCell(coli, 1)] === cell) &&
                (board[xyToCell(coli, 2)] === cell)) {
                    let obj = {cell, "direction": `v-${coli}`}
                    return obj;
            }
        }
    }

    // diagonal /
    cell = board[4];

    if (cell !== null) {

        if ((board[2] === cell) && (board[6] === cell)) {
            let obj = {cell, "direction": "d-main"}    
            return obj;
        }

        // diagonal \
        if ((board[0] === cell) && (board[8] === cell)) {
            let obj = {cell, "direction": "d-notmain"}
            return obj;
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
        if(findWinner(board)){
            if (findWinner(board).cell === 'O') {
                return -100 + depth;
            } else if (findWinner(board).cell === 'X') {
                return 100 - depth;
            }
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
    var winnerText = document.getElementById("winner")

    if (winner) {
        winnerText.innerHTML = `${winner.cell} Wins!`
        gameOver = true;
    }

    else if (isBoardFull(board)) {
        winnerText.innerHTML = "Draw!"
        gameOver = true;
    }

    if (gameOver) {
        // If game is over, no longer respond to board clicks
        $("#game-board td").off("click");
        document.getElementById('start-game').disabled = false;
        document.getElementById('starting').disabled = false;
        document.getElementById('diff').disabled = false;
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

    if (placePiece(cellNumber, symbol)) {
        updateBoard();

        if (! checkGameOver(board)) {
            computerMove(board, !maximizing, best => {board[best] = CPUSymbol; console.log(best)})
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


function startGame(depth, startingPlayer) {
    // Handle start-game button
    document.getElementById('start-game').disabled = true;
    document.getElementById('starting').disabled = true;
    document.getElementById('diff').disabled = true;
    initializeBoard();
    updateBoard();
    document.getElementById("winner").innerHTML = "Game is running!"


    // Allow clicks on game board
    $('#game-board td').on('click', handleClick);

    maxDepth = depth
    maximizing = parseInt(startingPlayer);
    symbol = maximizing ? "X" : "O"
    CPUSymbol = !maximizing ? "X" : "O"
    if (!maximizing) {
        let firstChoices = [0,2,4,6,8];
        let firstChoice = firstChoices[Math.floor(Math.random() * firstChoices.length)]
        board[firstChoice] = CPUSymbol
        updateBoard();
        checkGameOver(board);
    }

    // Remove start-game button
    // $(this).remove();
}


$("#start-game").on("click", () => {
    const startingDiv = document.getElementById("starting");
    const starting = startingDiv.options[startingDiv.selectedIndex].value;
    const diffDiv = document.getElementById("diff")
    const diff = diffDiv.options[diffDiv.selectedIndex].value;
    startGame(diff, starting)
});