// A palindromic number reads the same both ways.
// The largest palindrome made from the product of two 2-digit numbers
// is 9009 = 91 \times 99.
// Find the largest palindrome made from the product of two 3-digit numbers.

// let x = 10;
// let y = 10;


const palindromes: number[] = [];
let largest_found = 0;

for (let x = 10; x < 1000; x++) {
    for (let y = 10; y < 1000; y++) {
        let z = x*y;
        // check if z is palindrome
        // 1) get string element of z
        let z_string = z.toString();
        // 2) convert z_string into array of numbers
        let z_array = z_string.split(''); // no separator means split every char
        // reverse the array and then compare
        let z_string_rev = z_array.slice().reverse().join('');
        if (z_string === z_string_rev) {
            // check if its larger
            if (z > largest_found) {
                largest_found = z;
            }
        }
    }
}

console.log(largest_found)
// console.dir(palindromes, { depth: null, maxArrayLength: null });
