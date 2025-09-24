// The prime factors of 13195 are 5, 7, 13 and 29.
// What is the largest prime factor of the number 600851475143?
function prime_factorizor(n) {
    const primes = [];
    const sqroot = Math.sqrt(n);
    let i = 2; // we can skip 1
    while (i < sqroot) {
        if (n % i === 0) {
            primes.push(i);
            n = n / i;
        }
        i += 1;
    }
    return primes;
}
console.log(prime_factorizor(600851475143));
//# sourceMappingURL=3.js.map