// 2520 is the smallest number that can be divided by each of the numbers 
// from 1 to 10 without any remainder.
// What is the smallest positive number that is evenly divisible (divisible 
// with no remainder) by all of the numbers from 1 to 20?

const starttime = performance.now();
let i = 1000;
let ops = 0;
while (true) {
    let found = true;
    for (let x = 1; x <= 20; x++) {
        // if we find any one that isnt divisible, this iteration is no good
        if (i % x !== 0) {
            i += 1;
            found = false;
            break
        } else {
            ops += 1;
        }
    }
    // if found is still true that means it made it through all numbers
    if (found === true) {
        console.log(i);
        break
    }
}
console.log(`Operations: ${ops}`)
console.log(`Elapsed: ${(performance.now() - starttime).toFixed()}`)