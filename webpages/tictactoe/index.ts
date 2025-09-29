
const winner_label = document.querySelector('.winner-label') as HTMLElement;
let current_player: number = 1;
let game_state: boolean = true;

//     self.minimax_counter = 0
//     self.pruning_counter = 0
//     self.depth_limit_counter = 0
let minimax_counter = 0;
let pruning_counter = 0;
let depth_limit_counter = 0;




const player_map = {
    1: "X",
    2: "O"
}

const bitgrid: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]

const pos_lookup: [number, number][] = [
    [0,0], [0,1], [0,2],  
    [1,0], [1,1], [1,2],  
    [2,0], [2,1], [2,2]
]

function playTurn(event: MouseEvent) {

    if (game_state === false) {
        return;
    }    

    const target = event.target as HTMLElement;
    const cell_num = target.id.replace('cell', '');
    const pos = pos_lookup[Number(cell_num) - 1];

    if (bitgrid[pos[0]][pos[1]] !== 0) {
        return;
    }

    bitgrid[pos[0]][pos[1]] = current_player;
    target.textContent = player_map[current_player];

    const winner = checkWinner();
    if (winner !== -1) {
        game_state = false;
        winner_label.textContent = winner !== 0 ? `Winner: ${player_map[winner]}` : `Draw game!`
    }

    current_player = current_player === 1 ? 2 : 1;
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

function checkWinner(): number {
    // return 0 for draw, 1 for player1, 2 for player2
    // return -1 for game not over yet
    
    const gridSize = bitgrid.length;
    const rows = bitgrid;
    const columns = Array.from({ length: gridSize }, (_value, index) => 
        bitgrid.map(row => row[index])
    );
    const mainDiag = [Array.from({ length: gridSize }, (_, i) => bitgrid[i][i])];
    const antiDiag = [Array.from({ length: gridSize }, (_, i) => bitgrid[i][gridSize - i - 1])];
    const all_lines = [...rows, ...columns, ...mainDiag, ...antiDiag];
    
    for (const player of [1, 2]) {
        if (all_lines.some(line => line.every(cell => cell === player))) {
            console.log("Winner found")
            return player;
        }
    }

    // Check if game is still ongoing (is board full)    
    const boardNotFull = (bitgrid.some(row => row.some(cell => cell === 0)));
    return boardNotFull ? -1 : 0; // -1 for ongoing, 0 for draw

}

function computerTurn () {
    
    minimax_counter = 0;
    pruning_counter = 0;
    depth_limit_counter = 0;

    const boardCopy = structuredClone(bitgrid)
    const comp_move = await computerTurnWorker(boardCopy)

}

function computerTurn(): [number, number] {
    const boardCopy = [...intBoard.map(row => [...row])]; // simple copy
    const [_, bestMove] = minimax(boardCopy, 0, true, -Infinity, Infinity);
    
    console.log(`Minimax calls: ${minimaxCounter}, Pruned: ${pruningCounter}`);
    
    intBoard[bestMove[0]][bestMove[1]] = 2;
    moveCounter++;
    
    return bestMove;
}