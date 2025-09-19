// The sum of the squares of the first ten natural numbers is,
// 1^2 + 2^2 + ... + 10^2 = 385.
// The square of the sum of the first ten natural numbers is,
// (1 + 2 + ... + 10)^2 = 55^2 = 3025.

// Hence the difference between the sum of the squares of the first 
// ten natural numbers and the square of the sum is 3025 - 385 = 2640.

// Find the difference between the sum of the squares of the first one 
// hundred natural numbers and the square of the sum.

// export {};

const range = 100;
let sum_of_squares = 0;
let square_of_sums = 0;
for (let x = 1; x <= range; x++) {
    sum_of_squares += x*x;
    square_of_sums += x
}
square_of_sums *= square_of_sums;
console.log(`${square_of_sums} - ${sum_of_squares} = ${square_of_sums-sum_of_squares}`)