// If we list all the natural numbers below 10 that are multiples
// of 3 or 5, we get 3, 5, 6 and 9. The sum of these multiples is 23.
// Find the sum of all the multiples of 3 or 5 below 1000.

// const sum = arr => arr.reduce((a, b) => a + b, 0);
// full version:
function sum(arr) {
    return arr.reduce(function(a, b) {
      return a + b;
    }, 0);
  }
  

// const multiples = []
let counter = 0
for (let x = 1; x < 1000; x++) {
    if (x % 3 === 0 || x % 5 === 0) {
        // multiples.push(x)
        counter += x;
    }
}
// console.log(sum(multiples))
console.log(counter)