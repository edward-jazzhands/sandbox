// By listing the first six prime numbers: 2, 3, 5, 7, 11, and 13, 
// we can see that the 6th prime is 13.
// What is the 10,001st prime number?

// make prime number finder

function prime_checker(n: number): boolean {
    // this check should be unnecessary if we're only inputting
    // odd numbers into the function
    if (n % 2 === 0) {
        return false;
    }
    
    for (let x = 3; x <= Math.sqrt(n); x += 2) {
        if (n % x === 0) {
            return false;
        }
    }
    return true;
}

let amt_found = 1;
let prime_pos = 10001;
let i = 3;  // start on 3
while (true) {
    if (prime_checker(i) === true) {
        amt_found += 1;
        if (amt_found === prime_pos) {
            break
        }
    }
    i += 2;   // increment by 2 to only check odd numbers
}
console.log(i)
