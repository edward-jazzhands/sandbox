// Create array of repeated values
const fives = Array.from({ length: 3 }, () => 5);
console.log(fives); // [5, 5, 5]

// Create array with calculations
const squares = Array.from({ length: 5 }, (_, i) => i * i);
console.log(squares); // [0, 1, 4, 9, 16]

// Create array of strings
const items = Array.from({ length: 3 }, (_, i) => `Item ${i + 1}`);
console.log(items); // ['Item 1', 'Item 2', 'Item 3']

// Convert string to array (common use)
const letters = Array.from("hello");
console.log(letters); // ['h', 'e', 'l', 'l', 'o']

// Convert Set to array
const uniqueNumbers = Array.from(new Set([1, 1, 2, 3, 3]));
console.log(uniqueNumbers); // [1, 2, 3]

//==================
// Creating Arrays  
//==================

// Using spread operator with keys()
const nums1 = [...Array(5).keys()];
console.log(nums1); // [0, 1, 2, 3, 4]

// Using Array.from() without mapping function, then map
const nums2 = Array.from({length: 5}).map((_, i) => i);
console.log(nums2); // [0, 1, 2, 3, 4]

// For range starting from 1
const oneToFive = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(oneToFive); // [1, 2, 3, 4, 5]

// Array.from(arrayLike, mapFunction, thisArg)
// Creates a new array from an array-like or iterable object

// Basic usage - create array of specific length:
const emptyArray = Array.from({ length: 5 });
console.log(emptyArray); // [undefined, undefined, undefined, undefined, undefined]

// With mapping function - create array with values:
const numbersArray = Array.from({ length: 5 }, (value, index) => index);
console.log(numbersArray); // [0, 1, 2, 3, 4]

// A simple tic-tac-toe example:
const gridSize = 3;
const bitgrid = [
    [1, 2, 3],
    [4, 5, 6], 
    [7, 8, 9]
];

// Create columns by extracting each column index:
const columns2 = Array.from({ length: gridSize }, (value, index) => 
    bitgrid.map(row => row[index])
    // For every element (row) in the bitgrid, return the element
    // in the row at the current index
);
// This creates:
// col=0: bitgrid.map(row => row[0]) → [1, 4, 7]
// col=1: bitgrid.map(row => row[1]) → [2, 5, 8] 
// col=2: bitgrid.map(row game/index=> row[2]) → [3, 6, 9]

// Alternative ways to create the same thing:
const columnsManual = [
    [bitgrid[0][0], bitgrid[1][0], bitgrid[2][0]], // [1, 4, 7]
    [bitgrid[0][1], bitgrid[1][1], bitgrid[2][1]], // [2, 5, 8]
    [bitgrid[0][2], bitgrid[1][2], bitgrid[2][2]]  // [3, 6, 9]
];

// ========================================
// 3. PYTHON COMPREHENSIONS vs JS ARRAY METHODS
// ========================================

// Python list comprehension:
// [expression for item in iterable if condition]

// Python: all(cell == player for cell in line)
// This checks if ALL cells in line equal player

// Javascript: .some() returns true if AT LEAST ONE element passes the test
// .every() returns true if ALL elements pass the test

// JavaScript equivalent using .every():
const line = [1, 1, 1];
const player = 1;

// Long form:
const allMatch = line.every(function myfunc(cell) {
    return cell === player;
});

// Arrow function (short form):
const allMatchArrow = line.every(cell => cell === player);

// Even more examples:
const numbers = [2, 4, 6, 8];
// Python: all(num % 2 == 0 for num in numbers)
const allEven = numbers.every(num => num % 2 === 0); // true
// Python: any(num > 5 for num in numbers) 
const anyGreaterThan5 = numbers.some(num => num > 5); // true

const testArray = [1, 3, 5, 8, 9];
// Check if any number is even:
const hasEven = testArray.some(num => num % 2 === 0); // true (8 is even)
// Check if all numbers are odd:
const allOdd = testArray.every(num => num % 2 === 1); // false (8 is even)

// In our tic-tac-toe context:
const allPossibleLines = [
    [1, 1, 1], // winning line for player 1
    [0, 2, 0], // not a winning line
    [2, 1, 0]  // not a winning line
];

// Check if ANY line is a win for player 1:
const player1Wins = allPossibleLines.some(line => 
    line.every(cell => cell === 1)
); // true