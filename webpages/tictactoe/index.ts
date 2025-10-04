
const winner_label = document.querySelector('.winner-label') as HTMLElement;
let current_player: number = 1;
let game_state: boolean = true;
let move_counter = 0;
const max_depth = 10;

//     self.minimax_counter = 0
//     self.pruning_counter = 0
//     self.depth_limit_counter = 0
let minimax_counter = 0;
let pruning_counter = 0;
let depth_limit_counter = 0;

const cell1 = document.querySelector('#cell1') as HTMLElement;
const cell2 = document.querySelector('#cell2') as HTMLElement;
const cell3 = document.querySelector('#cell3') as HTMLElement;
const cell4 = document.querySelector('#cell4') as HTMLElement;
const cell5 = document.querySelector('#cell5') as HTMLElement;
const cell6 = document.querySelector('#cell6') as HTMLElement;
const cell7 = document.querySelector('#cell7') as HTMLElement;
const cell8 = document.querySelector('#cell8') as HTMLElement;
const cell9 = document.querySelector('#cell9') as HTMLElement;

const player_map = {
    1: "X",
    2: "O"
}

const bitgrid: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]
const gridSize = bitgrid.length;

// this uses the array indeces (ie cell9 = [2, 2])
const pos_lookup: [number, number][] = [
    [0,0], [0,1], [0,2], [1,0], [1,1], [1,2], [2,0], [2,1], [2,2]
]

const cell_lookup: HTMLElement[][] = [
    [cell1, cell2, cell3],
    [cell4, cell5, cell6],
    [cell7, cell8, cell9]
]

function playTurn(event: MouseEvent) {

    if (game_state === false) {
        return;
    }
    const current_player = 1;

    const target = event.target as HTMLElement;
    const cell_num = Number(target.id.replace('cell', ''));
    const pos = pos_lookup[cell_num - 1];

    if (bitgrid[pos[0]][pos[1]] !== 0) {
        return;
    }

    bitgrid[pos[0]][pos[1]] = current_player;
    move_counter++;
    target.textContent = player_map[current_player];

    const winner = checkWinner(bitgrid);
    if (winner !== -1) {
        game_state = false;
        winner_label.textContent = winner !== 0 ? `Winner: ${player_map[winner]}` : `Draw game!`
    } else {
        computerTurn();
    }
}

function reset() {
    const cells = document.querySelectorAll('.cell')
    cells.forEach(cell => {
        cell.textContent = null;
    });
    bitgrid.forEach(row => {
        row.fill(0);
    });
    game_state = true;
    winner_label.textContent = "Playing";
}

function checkWinner(grid: number[][]): number {
    // return 0 for draw, 1 for player1, 2 for player2
    // return -1 for game not over yet
    
    const rows = grid;
    const columns = Array.from({ length: gridSize }, (_value, index) => 
        grid.map(row => row[index])
    );
    const mainDiag = [Array.from({ length: gridSize }, (_, i) => grid[i][i])];
    const antiDiag = [Array.from({ length: gridSize }, (_, i) => grid[i][gridSize - i - 1])];
    const all_lines = [...rows, ...columns, ...mainDiag, ...antiDiag];
    
    for (const player of [1, 2]) {
        if (all_lines.some(line => line.every(cell => cell === player))) {
            return player;
        }
    }

    // Check if game is still ongoing (is board full)    
    const boardNotFull = (grid.some(row => row.some(cell => cell === 0)));
    return boardNotFull ? -1 : 0; // -1 for ongoing, 0 for draw

}

function computerTurn() {

    winner_label.textContent = "Computer is thinking...";
    const current_player = 2;
    const boardCopy = structuredClone(bitgrid)
    // const boardCopy = [...intBoard.map(row => [...row])]; // simple copy

    const [_, bestMove] = minimax(boardCopy, 0, true, -Infinity, Infinity);
    console.log(`Minimax calls: ${minimax_counter}, Pruned: ${pruning_counter}`);
    if (bestMove === null) {
        throw new Error("Minimax returned null")
    }
    
    const row = bestMove[0];
    const col = bestMove[1];
    bitgrid[row][col] = current_player;
    move_counter++;

    const target = cell_lookup[row][col];
    target.textContent = player_map[current_player];
    
    const winner = checkWinner(bitgrid);
    if (winner !== -1) {
        game_state = false;
        winner_label.textContent = winner !== 0 ? `Winner: ${player_map[winner]}` : `Draw game!`
    } else {
        winner_label.textContent = "Your Turn";
    }
}

function minimax(
    board: number[][],
    depth: number,
    maximizingPlayer: boolean,
    alpha: number,
    beta: number
): [number, [number, number] | null] {

    minimax_counter++;

    const result = checkWinner(board);

    if (result === 2) {             // win for player 2
        return [10 - depth, null]
    }
    else if (result === 1) {        // win for player 1
        return [-10 + depth, null]
    }
    else if (result === 0) {        // move would result in a draw
        return [0, null]
    }

    if (depth === max_depth) {
        depth_limit_counter++;
        return [0, null]
    }

    let player = maximizingPlayer === true ? 2 : 1;
    let best_move: [number, number] = [-1, -1];
    let best_score = maximizingPlayer === true ? -Infinity : Infinity

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) {
                board[row][col] = player;
                const [score, _] = minimax(board, depth+1, !maximizingPlayer, alpha, beta)
                // undo the move:
                board[row][col] = 0;

                if (maximizingPlayer) {
                    if (score > best_score) {
                        best_score = score;
                        best_move = [row, col];
                        alpha = Math.max(score, alpha);
                    }
                } else {
                    if (score < best_score) {
                        best_score = score;
                        best_move = [row, col];
                        beta = Math.min(score, beta);
                    }
                }

                if (beta <= alpha) {
                    pruning_counter++;
                    break
                }
            }
        }
    }
    return [best_score, best_move];
}




// main.js - Your main application file

// Create a new worker by importing the worker file
// const worker = new Worker('worker.js');

// Listen for messages from the worker
// worker.addEventListener('message', (e) => {
//   console.log('Result from worker:', e.data);
// });

// Send data to the worker
// worker.postMessage(5);

// When you're done with the worker, terminate it
// worker.terminate();