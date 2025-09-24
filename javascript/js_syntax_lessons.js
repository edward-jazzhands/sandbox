// ========================================
// 1. SPREAD OPERATOR (...) 
// ========================================

// The spread operator "spreads" array elements
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const arr3 = [7, 8, 9];

// Without spread (creates nested arrays):
const nested = [arr1, arr2, arr3];
console.log(nested); // [[1,2,3], [4,5,6], [7,8,9]]

// With spread (flattens into single array):
const flattened = [...arr1, ...arr2, ...arr3];
console.log(flattened); // [1,2,3,4,5,6,7,8,9]

// In our tic-tac-toe example:
const rows = [[1,2,3], [4,5,6], [7,8,9]];
const columns = [[1,4,7], [2,5,8], [3,6,9]];
const diags = [[1,5,9], [3,5,7]];

// This creates one flat array of all lines to check:
const allLines = [...rows, ...columns, ...diags];
// Result: [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]]


// ========================================
// 4. FOR...OF LOOPS WITH CONST
// ========================================

// You CAN declare const in for loops because each iteration
// gets its own new binding/scope

for (const player of [1, 2]) {
    console.log(player); // 1, then 2
    // 'player' is constant within each iteration
    // but gets a new value each time
}

// This is different from traditional for loops:
for (let i = 0; i < 3; i++) {
    // 'i' changes value in the same binding
}

// More examples of for...of with const:
const colors = ['red', 'green', 'blue'];
for (const color of colors) {
    console.log(color); // Each color is constant per iteration
}

const grid = [[1,2], [3,4], [5,6]];
for (const row of grid) {
    console.log(row); // Each row is constant per iteration
}


// ========================================
// 6. ARROW FUNCTIONS - Multiple styles
// ========================================

// Traditional function:
function checkLine(line, player) {
    return line.every(function(cell) {
        return cell === player;
    });
}

// Arrow function - full form:
const checkLineArrow = (line, player) => {
    return line.every((cell) => {
        return cell === player;
    });
};

// Arrow function - concise (implicit return):
const checkLineShort = (line, player) => line.every(cell => cell === player);

// Arrow function - as inline callback:
lines.some(line => checkLine(line, player));

// When arrow function body is an expression (no {}), 
// it automatically returns that expression

// ========================================
// 7. PUTTING IT ALL TOGETHER - Step by step
// ========================================

function demonstrateFullProcess() {
    const board = [
        [1, 0, 2],
        [0, 1, 0], 
        [2, 0, 1]
    ];
    
    console.log("Original board:", board);
    
    // Step 1: Get rows (already have them)
    const rows = board;
    console.log("Rows:", rows);
    
    // Step 2: Extract columns using Array.from
    const columns = Array.from({ length: 3 }, (_, col) => 
        board.map(row => row[col])
    );
    console.log("Columns:", columns);
    
    // Step 3: Extract diagonals
    const mainDiag = [Array.from({ length: 3 }, (_, i) => board[i][i])];
    const antiDiag = [Array.from({ length: 3 }, (_, i) => board[i][3 - i - 1])];
    console.log("Main diagonal:", mainDiag);
    console.log("Anti diagonal:", antiDiag);
    
    // Step 4: Combine all lines using spread
    const allLines = [...rows, ...columns, ...mainDiag, ...antiDiag];
    console.log("All lines to check:", allLines);
    
    // Step 5: Check for winner
    for (const player of [1, 2]) {
        console.log(`Checking player ${player}:`);
        
        const hasWinningLine = allLines.some(line => {
            const isWinning = line.every(cell => cell === player);
            console.log(`  Line ${line}: ${isWinning ? 'WINNER!' : 'no win'}`);
            return isWinning;
        });
        
        if (hasWinningLine) {
            console.log(`Player ${player} wins!`);
            return player;
        }
    }
    
    console.log("No winner");
    return 0;
}

demonstrateFullProcess();