// THIS below is the traditional simple way shown in tutorials
function checkWinner2(board: number[][]) {
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (board[row][0] !== 0 && 
          board[row][0] === board[row][1] && 
          board[row][1] === board[row][2]) {
        return board[row][0];
      }
    }
    
    // Check columns
    for (let col = 0; col < 3; col++) {
      if (board[0][col] !== 0 && 
          board[0][col] === board[1][col] && 
          board[1][col] === board[2][col]) {
        return board[0][col];
      }
    }
    
    // Check main diagonal (top-left to bottom-right)
    if (board[0][0] !== 0 && 
        board[0][0] === board[1][1] && 
        board[1][1] === board[2][2]) {
      return board[0][0];
    }
    
    // Check anti-diagonal (top-right to bottom-left)
    if (board[0][2] !== 0 && 
        board[0][2] === board[1][1] && 
        board[1][1] === board[2][0]) {
      return board[0][2];
    }
    
    // Check for draw (board full)
    let isFull = true;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === 0) {
          isFull = false;
          break;
        }
      }
      if (!isFull) break;
    }
    
    if (isFull) {
      return 0; // Draw
    }
    
    return -1; // Game ongoing
}

// THIS is the much cooler l33t method for real coders
function checkWinner_best(): number {
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

// Here is the same function as above but fully commented / explained.
function checkWinnerWithComments(): number {
    // return 0 for draw, 1 for player1, 2 for player2
    // return -1 for game not over yet
    
    const gridSize = bitgrid.length;
    
    // Instead of manually checking all lines sequentially
    // (as seen in most tutorials), here we compile all the possible
    // lines beforehand - rows, columns, mainDiag, antiDiag
    // With a wee bit of math, we can greatly reduce the amount
    // of lines of code.

    const rows = bitgrid;
    const columns = Array.from({ length: gridSize }, (_value, index) => 
        bitgrid.map(row => row[index])
        // Array.from takes a mapping function to call on each element.
        // Create a new array, then on each element of the array,
        // call bitgrid.map to iter through the rows at that index
        // This will produce:
        // first col: row0[0], row1[0], row2[0]
        // send col:  row0[1], row1[1], row2[1]
        // send col:  row0[2], row1[2], row2[2]
    );
    const mainDiag = [Array.from({ length: gridSize }, (_, i) => bitgrid[i][i])];
    // grid[0][0], grid[1][1], grid[2][2] etc... forms a diagonal
    const antiDiag = [Array.from({ length: gridSize }, (_, i) => bitgrid[i][gridSize - i - 1])];
    // same thing on the anti-diag but backwards
    // (gridsize - i will make it start at the end and go back one as i increases)

    // Combine all possible lines into a single array
    const lines = [...rows, ...columns, ...mainDiag, ...antiDiag];
    
    // Now we can do operations on this entire `lines` object.
    
    // METHOD 1: using lines.some
    for (const player of [1, 2]) {
        if (lines.some(line => line.every(cell => cell === player))) {
            console.log("Winner found")
            return player;
        }
    }
    
    // METHOD 2: nested loop
    // for (const player of [1,2]) {
    //     for (const line of lines) {
    //         if (line.every(cell => cell === player)) {
    //             console.log("Winner found")
    //             return player;
    //         }
    //     }
    // }
    
    // No winner found - check for draw
    // we only need to find a single 0 to know board is not full
    if (bitgrid.some((row, index) => {
        return row.some(cell => cell === 0)
    })) {
        return -1;    // game still ongoing
    } else {
        return 0;     // game draw
    }
}

// ORIGINAL PYTHON:
// def calculate_winner(self, board: list[list[int]]) -> PlayerState | None:
//     """Returns a PlayerState if game is over, else returns None."""

//     rows = board
//     "MATH: each item in the board array is another array. A 2D list / bitgrid"

//     columns = list(zip(*board))
//     """MATH EXPLANATION:
//     zip will return a list of tuples with the same index from each iterable.
//     Above we 'unpack' using *board, this passes in all the rows of board as separate iterables.
//     thus we get:
//     Tuple 1 -> (row1[0], row2[0], row3[0]),
//     Tuple 2 -> (row1[1], row2[1], row3[1]),
//     etc..."""

//     main_diag = [[board[i][i] for i in range(self.grid_size)]]
//     """
//     board[0][0], board[1][1], board[2][2].. etc will form a diagonal starting at top left.
//     """

//     anti_diag = [[board[i][self.grid_size - i - 1] for i in range(self.grid_size)]]
//     """
//     board[0][2], board[1][1], board[2][0].. will form a diagonal starting at top right
//     """

//     # Combine all possible lines into a single list
//     lines = (rows + columns + main_diag + anti_diag)

//     def check_line(line: list[int], player: int) -> bool:
//         return all(cell == player for cell in line)

//     for player in (1, 2):
//         if any(check_line(line, player) for line in lines):     # Check for winner
//             return PlayerState.PLAYER1 if player == 1 else PlayerState.PLAYER2

//     if all(cell != 0 for row in board for cell in row):         # Check for draw
//         return PlayerState.EMPTY
    
//     return None